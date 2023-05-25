<script lang="ts">
	import '@/src/app.css'
	import { onMount } from 'svelte'
	import { navigating } from '$app/stores'
	import Seo from '@/src/components/SEO.svelte'
	import install from '@edgio/prefetch/window/install'
	import Detail from '@/src/components/Loading/Detail.svelte'
	import Listing from '@/src/components/Loading/Listing.svelte'
	onMount(() => {
		if (!(window.location.hostname === 'localhost')) {
			install()
		}
	})
</script>

<Seo />

<div class="relative flex min-h-screen w-full flex-col bg-white">
	{#if Boolean($navigating) && $navigating?.to?.url.pathname.includes('/t/')}
		<Detail />
	{:else if Boolean($navigating) && $navigating?.from?.url.pathname !== '/' && $navigating?.to?.url.pathname === '/'}
		<Listing />
	{:else}
		<slot />
	{/if}
</div>
