<script lang="ts">
	import { page } from '$app/stores'
	import Card from '@/src/components/Card.svelte'
	import Filters from '@/src/components/Loading/Filters.svelte'

	$: toggleFilter = $page.url.searchParams?.get('toggle') ?? '0'
</script>

<div class="z-10 mt-24 flex w-full flex-col sm:items-center">
	<h1 class="px-10 text-4xl font-bold text-black sm:text-center md:text-6xl">Find your Template</h1>
	<h3 class="mt-5 px-10 text-2xl font-light text-gray-800 sm:text-center md:max-w-full">Jumpstart your app development process with our pre-built solutions.</h3>
	<div class="mt-12 flex w-full flex-col items-start px-10 sm:mt-24 sm:flex-row lg:max-w-6xl xl:px-0">
		<div class="hide-if-not-script-available flex w-full min-w-[250px] flex-col sm:w-[300px]">
			<span class="text-md font-semibold text-black"> Filter Templates </span>
			<label class="relative mt-5 block rounded border border-gray-400/50 text-gray-400 duration-300 focus-within:border-black focus-within:text-black">
				<svg fill="currentColor" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<path
						d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
					/>
				</svg>
				<input type="text" placeholder="Search..." class="form-input block w-full appearance-none bg-transparent py-2 pl-10 text-black focus:outline-none" />
			</label>
			<div class="mt-8 h-[1px] w-full bg-gray-400/50" />
			<button class="focus:scale-x-2 mt-5 flex w-full cursor-pointer flex-row items-center justify-between p-2 py-1 hover:shadow focus:border focus:shadow sm:hidden">
				<span class="text-md font-semibold sm:hidden">Filter By:</span>
				<span class={['scale-x-75 scale-y-125', toggleFilter === '1' && 'rotate-90'].join(' ')}> &gt; </span>
			</button>
			<Filters />
		</div>
		<div class="hide-if-not-script-available mt-8 grid w-full grow grid-cols-1 gap-6 duration-300 sm:mt-0 sm:pl-8 lg:grid-cols-2 xl:grid-cols-3">
			{#each new Array(6).fill(0) as card}
				<Card loading={true} />
			{/each}
		</div>
	</div>
</div>
