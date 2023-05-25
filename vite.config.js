import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	ssr: {
		external: ['@edgio/prefetch/sw']
	}
}

export default config
