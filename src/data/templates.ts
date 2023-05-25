type Template = {
	name: string
	slug: string
	demoUrl: string
	overview?: string
	githubUrl: string
	publisher: string
	description: string
	css: string[]
	cms: string[]
	type: string[]
	framework: string[]
}

export const templates: Template[] = [
	{
		name: 'Link Hub Starter',
		slug: 'link-hub-starter',
		publisher: 'Edgio',
		description: 'A Link Hub built with Storyblok, Astro, and Edgio',
		framework: ['Astro'],
		demoUrl: 'https://rishi-raj-jain-link-hub-storyblok-astro-edgio-starter-default.layer0-limelight.link/me/rishi-raj-jain',
		type: ['Starter'],
		css: ['TailwindCSS'],
		cms: ['Storyblok'],
		githubUrl: 'https://github.com/rishi-raj-jain/link-hub-storyblok-astro-edgio-starter'
	}
]
