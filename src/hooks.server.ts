import { minify } from 'html-minifier'
import { dev } from '$app/environment'

const minification_options = {
	minifyCSS: true,
	decodeEntities: true,
	useShortDoctype: true,
	collapseWhitespace: true,
	trimCustomFragments: true,
	collapseBooleanAttributes: true,
	removeRedundantAttributes: true,
	processConditionalComments: true
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let page = ''
	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html
			if (done) {
				return dev ? page : minify(page, minification_options)
			}
		}
	})
}
