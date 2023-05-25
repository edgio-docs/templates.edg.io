import fs from 'fs'
import sharp from 'sharp'
import satori from 'satori'
import { join } from 'path'
import sizeOf from 'buffer-image-size'
import { Resvg } from '@resvg/resvg-js'
import { html as toReactNode } from 'satori-html'

export async function getBase64ImageUrl(imageUrl: string, width: number = 100) {
	const upstreamImage = new URL('/', 'https://opt.moovweb.net')
	if (imageUrl) upstreamImage.searchParams.set('img', imageUrl)
	if (width) upstreamImage.searchParams.set('width', width.toString())
	const response = await fetch(upstreamImage.toString())
	const buffer = await response.arrayBuffer()
	const imageBuffer = await sharp(buffer).blur().toBuffer()
	const { width: imageWidth, height } = sizeOf(imageBuffer)
	const base64 = imageBuffer.toString('base64')
	return { width: imageWidth, height, image: `data:image/jpeg;base64,${base64}` }
}

export async function componentToPng(component: any, props: SvelteAllProps, height: number, width: number) {
	const result = component.render(props)
	const markup = toReactNode(`${result.html}<style>${result.css.code}</style>`)
	const svg = await satori(markup, {
		height: +height,
		width: +width,
		fonts: [
			{
				weight: 400,
				name: 'Inter',
				data: fs.readFileSync(join(process.cwd(), 'static', 'fonts', 'Inter-Regular.otf'))
			}
		]
	})
	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: +width
		}
	})
	const png = resvg.render()
	return new Response(png.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	})
}
