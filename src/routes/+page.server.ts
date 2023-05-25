import type { Seo } from '@/src/classes'
import { getBase64ImageUrl } from '@/src/image'
import { templates } from '@/src/data/templates'
import { getDescription, getScreenshotLoader, getTitle } from '@/src/utils'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	// Create SEO Object
	const seo: Seo = {
		title: getTitle(),
		description: getDescription(),
		domain: url.origin,
		pathname: url.pathname
	}

	let searchParam = url.searchParams.get('search')
	let keyNameParam = url.searchParams.get('keyName')

	try {
		if (keyNameParam?.length > 0) {
			keyNameParam = JSON.parse(decodeURIComponent(keyNameParam))
		}
	} catch (e) {
		// @ts-ignore
		console.log(e.message || e.toString())
		keyNameParam = null
	}

	let filteredTemplates = templates.map((i) => ({
		...i,
		blurDataURL: ''
	}))

	if (searchParam) {
		filteredTemplates = filteredTemplates.filter((i) => i.name.includes(searchParam) || i.description.includes(searchParam))
	}

	if (keyNameParam) {
		const keys = Object.keys(keyNameParam)
		keys.forEach((i) => {
			if (keyNameParam[i]?.length < 1) delete keyNameParam[i]
		})
		if (Object.keys(keyNameParam).length > 0) {
			filteredTemplates = filteredTemplates.filter((i) => {
				for (const j of Object.keys(keyNameParam)) {
					if (i[j] && i[j].length > 0) {
						for (const eachAttr of i[j]) {
							if (keyNameParam[j].includes(eachAttr)) {
								return true
							}
						}
					}
				}
				return false
			})
		}
	}

	// Create blurURLs for each demoUrl screenshot
	for (let i = 0; i < filteredTemplates.length; i++) {
		filteredTemplates[i]['blurDataURL'] = (await getBase64ImageUrl(getScreenshotLoader(filteredTemplates[i].demoUrl), 10)).image
	}

	if (filteredTemplates?.length > 0) {
		seo['preloads'] = [{ url: getScreenshotLoader(filteredTemplates[0].demoUrl), as: 'image' }]
	}

	return {
		seo,
		templates: filteredTemplates
	}
}
