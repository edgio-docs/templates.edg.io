import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { redirect } from '@sveltejs/kit'
import { getBase64ImageUrl } from '@/src/image'
import { templates } from '@/src/data/templates'
import { getScreenshotLoader, getTitle, toHTML } from '@/src/utils'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url, params }) => {
	const slug = params.slug

	const findTemplate = templates.find((i) => i.slug === params.slug)

	// If such a template data exists, otherwise redirect to home page
	if (!findTemplate) throw redirect(307, '/')

	const overviewPath = join(process.cwd(), 'overviews', slug + '.md')
	if (existsSync(overviewPath)) {
		findTemplate['overview'] = await toHTML(readFileSync(overviewPath, 'utf8'))
	}

	// Create the template data
	const template = {
		blurImageURL: '',
		...findTemplate
	}

	if (template?.demoUrl) {
		template['blurImageURL'] = (await getBase64ImageUrl(getScreenshotLoader(template.demoUrl))).image
	}

	// Create social shareable image URL
	const socialImage = new URL('/og', url.origin)
	if (template.name) socialImage.searchParams.set('text', template.name)
	if (template.description) socialImage.searchParams.set('description', template.description)
	if (template.demoUrl) socialImage.searchParams.set('image', getScreenshotLoader(template.demoUrl))

	// Create SEO Object
	const seo = {
		title: template.name + ' - ' + getTitle(),
		description: template.description,
		domain: url.origin,
		pathname: url.pathname,
		image: socialImage.toString(),
		preloads: template?.demoUrl ? [{ url: getScreenshotLoader(template.demoUrl), as: 'image' }] : []
	}

	return {
		seo,
		slug,
		template
	}
}
