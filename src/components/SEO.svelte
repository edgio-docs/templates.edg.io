<script lang="ts">
	import { page } from '$app/stores'
	import type { Seo } from '@/src/classes'
	import { getDescription, getDomain, getScreenshotLoader, getTitle } from '@/src/utils'

	function getOGImageURL(data: Seo) {
		if (!data) return getScreenshotLoader(getDomain())
		if (data?.image) return data.image
		const { domain = getDomain(), description = getDescription() } = data
		let initialOGImage = new URL('/og', domain)
		initialOGImage.searchParams.set('text', encodeURIComponent(getTitle()))
		initialOGImage.searchParams.set('description', encodeURIComponent(getDescription(description)))
		initialOGImage.searchParams.set('image', encodeURIComponent(getScreenshotLoader(getDomain(domain))))
		return initialOGImage.toString()
	}

	$: title = getTitle($page.data?.seo?.title)
	$: description = getDescription($page.data?.seo?.description)
	$: pathname = $page.data?.seo?.pathname ?? ''
	$: preloads = $page.data?.seo?.preloads ?? []
	$: domain = getDomain($page.data?.seo?.domain)
	$: image = getOGImageURL($page.data?.seo)
</script>

<svelte:head>
	<!-- Global Metadata -->
	<meta charset="utf-8" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<link rel="icon" href={domain + '/branding/symbol.svg'} type="image/png" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<!-- Primary Meta Tags -->
	{#if title}
		<title>{title}</title>
		<meta name="title" content={title} />
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<!-- Open Graph / Facebook -->
	{#if title}
		<meta property="og:title" content={title} />
	{/if}
	<meta property="og:type" content="website" />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	{#if domain && pathname}
		<meta property="og:url" content={domain + pathname} />
	{/if}
	<!-- Twitter -->
	{#if title}
		<meta property="twitter:title" content={title} />
	{/if}
	{#if description}
		<meta property="twitter:description" content={description} />
	{/if}
	<meta property="twitter:card" content="summary_large_image" />
	{#if image}
		<meta property="twitter:image" content={image} />
	{/if}
	{#if domain && pathname}
		<meta property="twitter:url" content={domain + pathname} />
	{/if}
	{#if preloads.length > 0}
		{#each preloads as preload}
			{#if preload.url && preload.as}
				<link rel="preload" href={preload.url} as={preload.as} />
			{/if}
		{/each}
	{/if}
</svelte:head>
