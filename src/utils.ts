import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

export async function toHTML(md: string) {
	if (!md || md.length < 1) return ''
	return await unified().use(remarkParse).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).processSync(md).toString()
}

export const getScreenshotLoader = (url: string) => {
	return 'https://rishi-raj-jain-screenshot-default.layer0-limelight.link?url=' + url
}

export function getTitle(val?: string) {
	return val ?? 'Find your Template - Edgio'
}

export function getDescription(val?: string) {
	return val ?? 'Jumpstart your app development process with our pre-built solutions.'
}

export function getDomain(val?: string) {
	return val ?? 'https://templates.edg.io'
}
