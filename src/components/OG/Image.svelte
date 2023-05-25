<script lang="ts">
	export let text: string
	export let width: number
	export let image: string
	export let height: number
	export let description: string
</script>

<div style={`width: ${width}px; height: ${height}px; display: flex; flex-direction: row; background: white;`}>
	<div style="width: 50%; height: 100%; border-right: 1px solid #C1C1C150; display: flex; flex-direction: column; justify-content: center; padding-left: 75px;">
		<img alt={text} src="https://cdn.svgporn.com/logos/edgio-icon.svg" style="height: 75px; width: 75px;" />
		<span style="margin-top: 25px; font-size: 30px; font-weight: 800;">
			{text}
		</span>
		<span style="margin-top: 15px; font-size: 20px; padding-right: 25px; line-height: 30px;">
			{description}
		</span>
	</div>
	<img alt={text} src={image} style="height: 100%; width: 50%; object-fit: contain;" />
</div>
