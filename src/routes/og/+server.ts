import { componentToPng } from '@/src/image'
import Image from '@/src/components/OG/Image.svelte'

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const width = 1200
	const height = 630
	const query = url.searchParams
	const text = decodeURIComponent(query?.get('text'))
	const image = decodeURIComponent(query?.get('image'))
	const description = decodeURIComponent(query?.get('description'))
	return componentToPng(Image, { text, image, width, height, satori: true, description }, height, width)
}
