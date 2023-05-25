<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page, navigating } from '$app/stores'
	import Card from '@/src/components/Card.svelte'
	import Filters from '@/src/components/Loading/Filters.svelte'

	export let data
	let searchFilter: string = $page.url?.searchParams?.get('search') ?? ''

	function updateQuerySearch(val: string) {
		if (typeof document !== 'undefined') {
			const newURL = new URL($page.url)
			if (val.length > 0) {
				newURL.searchParams.set('search', val)
			} else {
				newURL.searchParams.delete('search')
			}
			goto(newURL.toString(), { replaceState: true, keepFocus: true })
		}
	}

	function updateQueryKeyName(key: string, value: string) {
		const searchParams: URLSearchParams = $page.url.searchParams
		const newURL: URL = new URL($page.url)
		let keyNameParam = searchParams.get('keyName')
		if (keyNameParam) {
			keyNameParam = JSON.parse(decodeURIComponent(keyNameParam))
			if (keyNameParam.hasOwnProperty(key)) {
				if (keyNameParam[key].includes(value)) {
					if (keyNameParam[key].indexOf(value) > -1) {
						keyNameParam[key].splice(keyNameParam[key].indexOf(value), 1)
					}
				} else {
					keyNameParam[key].push(value)
				}
			} else {
				keyNameParam[key] = [value]
			}
			newURL.searchParams.set('keyName', encodeURIComponent(JSON.stringify(keyNameParam)))
		} else {
			newURL.searchParams.set('keyName', encodeURIComponent(JSON.stringify({ [key]: [value] })))
		}
		goto(newURL.toString())
	}

	// @ts-ignore
	function onlyUnique(value, index, array) {
		return array.indexOf(value) === index
	}

	// @ts-ignore
	function getTypes(data) {
		if (!data) return { '': [] }
		const parentFilters: string[] = ['Type', 'Framework', 'CSS', 'Database', 'CMS']
		const parentDict: { [name: string]: string[] } = {}
		parentFilters.forEach((i) => {
			parentDict[i] = []
		})
		// @ts-ignore
		data.forEach((b) => {
			parentFilters.forEach((eachParentFilter) => {
				const lowerParentFilter = eachParentFilter.toLowerCase()
				if (b.hasOwnProperty(lowerParentFilter)) {
					b[lowerParentFilter].forEach((j: string) => {
						if (j.length > 0) {
							parentDict[eachParentFilter] = [...parentDict[eachParentFilter], j]
						}
						parentDict[eachParentFilter] = parentDict[eachParentFilter].filter(onlyUnique)
					})
				}
			})
		})
		return parentDict
	}

	$: updateQuerySearch(searchFilter)
	$: types = getTypes(data?.templates)
	$: getChildState = (key: string, value: string) => {
		const searchParams = $page.url.searchParams
		let keyNameParam = searchParams.get('keyName')
		if (keyNameParam) {
			keyNameParam = JSON.parse(decodeURIComponent(keyNameParam))
			if (keyNameParam.hasOwnProperty(key)) {
				return keyNameParam[key].includes(value)
			}
			return false
		}
		return false
	}
	$: toggleFilter = $page.url.searchParams?.get('toggle') ?? '0'

	onMount(() => {
		const resizeHandler = () => {
			if (window.innerWidth >= 640) {
				const newURL = new URL($page.url)
				if (newURL.searchParams.get('toggle') === '0') {
					newURL.searchParams.set('toggle', '1')
					goto(newURL.toString(), { replaceState: true, keepFocus: true })
				}
			}
		}
		resizeHandler()
		window.addEventListener('resize', resizeHandler)
		return () => {
			window.removeEventListener('resize', resizeHandler)
		}
	})
</script>

<div class="z-10 mt-24 flex w-full flex-col sm:items-center">
	<h1 class="px-10 text-4xl font-bold text-black sm:text-center md:text-6xl">Find your Template</h1>
	<h2 class="mt-5 px-10 text-2xl font-light text-gray-800 sm:text-center md:max-w-full">Jumpstart your app development process with our pre-built solutions.</h2>
	<div class="mt-12 flex w-full flex-col items-start px-10 sm:mt-24 sm:flex-row lg:max-w-6xl xl:px-0">
		<div class="hide-if-not-script-available flex w-full min-w-[250px] flex-col sm:w-[300px]">
			<span class="text-md font-semibold text-black"> Filter Templates </span>
			<label class="relative mt-5 block rounded border border-gray-400/50 text-gray-400 duration-300 focus-within:border-black focus-within:text-black">
				<svg fill="currentColor" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<path
						d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search..."
					bind:value={searchFilter}
					class="form-input block w-full appearance-none bg-transparent py-2 pl-10 text-black focus:outline-none"
				/>
			</label>
			<div class="mt-8 h-[1px] w-full bg-gray-400/50" />
			<button
				on:click={() => {
					const newURL = new URL($page.url)
					newURL.searchParams.set('toggle', Math.abs(1 - parseInt(toggleFilter)).toString())
					goto(newURL.toString(), { replaceState: true, keepFocus: true })
				}}
				class="focus:scale-x-2 mt-5 flex w-full cursor-pointer flex-row items-center justify-between p-2 py-1 hover:shadow focus:border focus:shadow sm:hidden"
			>
				<span class="text-md font-semibold sm:hidden">Filter By:</span>
				<span class={['scale-x-75 scale-y-125', toggleFilter === '1' && 'rotate-90'].join(' ')}> &gt; </span>
			</button>
			{#if Boolean($navigating) && $navigating?.to?.url.pathname === '/'}
				<Filters />
			{:else if types && Object.keys(types)?.length > 0 && Object.values(types).flat().length > 0}
				<div class="hidden flex-col sm:flex">
					{#each Object.keys(types) as head}
						{#if types.hasOwnProperty(head) && types[head].length > 0}
							<span class="text-md mt-5 border-b border-black pb-2 font-semibold text-black">{head}</span>
							{#each types[head] as child, childIndex}
								<button
									on:click={() => {
										updateQueryKeyName(head.toLowerCase(), child)
									}}
									class={[
										types[head].length !== childIndex + 1 ? 'border-b' : '',
										getChildState(head.toLowerCase(), child) ? 'font-semibold' : '',
										'mt-2 flex cursor-pointer flex-row items-center space-x-3 pb-2 accent-black'
									].join(' ')}
								>
									<input type="checkbox" checked={getChildState(head.toLowerCase(), child)} />
									<span>
										{child}
									</span>
								</button>
							{/each}
						{/if}
					{/each}
				</div>
				{#if toggleFilter === '1'}
					<div class="flex flex-col sm:hidden">
						{#each Object.keys(types) as head}
							{#if types.hasOwnProperty(head) && types[head].length > 0}
								<span class="text-md mt-5 border-b border-black pb-2 font-semibold text-black">{head}</span>
								{#each types[head] as child, childIndex}
									<button
										on:click={() => {
											updateQueryKeyName(head.toLowerCase(), child)
										}}
										class={[
											types[head].length !== childIndex + 1 ? 'border-b' : '',
											getChildState(head.toLowerCase(), child) ? 'font-semibold' : '',
											'mt-2 flex cursor-pointer flex-row items-center space-x-3 pb-2 accent-black'
										].join(' ')}
									>
										<input type="checkbox" checked={getChildState(head.toLowerCase(), child)} />
										<span>
											{child}
										</span>
									</button>
								{/each}
							{/if}
						{/each}
					</div>
				{/if}
			{:else}
				<span class="mt-8 w-full rounded border py-2 text-center text-sm">No relevant filters found.</span>
			{/if}
		</div>
		<noscript class="mt-8 grid grow grid-cols-1 gap-6 sm:mt-0 sm:grid-cols-2 sm:pl-8 lg:grid-cols-3">
			{#each data?.templates as item, index}
				<Card {index} {item} />
			{/each}
		</noscript>
		{#if Boolean($navigating) && $navigating?.to?.url.pathname === '/'}
			<div class="hide-if-not-script-available mt-8 grid w-full grow grid-cols-1 gap-6 duration-300 sm:mt-0 sm:pl-8 lg:grid-cols-2 xl:grid-cols-3">
				{#each new Array(6).fill(0) as card}
					<Card loading={true} />
				{/each}
			</div>
		{:else if data?.templates?.length > 0}
			<div class="hide-if-not-script-available mt-8 grid grow grid-cols-1 gap-6 sm:mt-0 sm:pl-8 lg:grid-cols-2 xl:grid-cols-3">
				{#each data.templates as item, index}
					<Card {index} {item} />
				{/each}
			</div>
		{:else}
			<div class="mt-8 flex w-full flex-col items-center justify-center sm:mt-0 sm:pl-8">
				<span class="w-full rounded border px-3 py-10 text-center sm:px-0">No search results found. Try adjusting your search query.</span>
			</div>
		{/if}
	</div>
</div>
