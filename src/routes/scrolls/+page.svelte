<script>
	import ScrollComponent from '../../components/ContentViews/ScrollComponent.svelte';

	let common_dir = "http://172.20.10.9:5173/sequences/"
</script>

<div class="home-wrap">
	<ScrollComponent dir={`${common_dir}light_lesserafim_sequence/lesserafim`} length={300} height={2000}/>
	<ScrollComponent dir={`${common_dir}heavy_satisfaction_sequence/satisfaction`} length={1063} height={8000}/>
	<ScrollComponent dir={`${common_dir}satisfaction2_sequence/satisfaction`} length={921} height={6000}/>
	<ScrollComponent dir={`${common_dir}ramen_sequence/ramen`} length={2934} height={12000}/>
</div>

<style>
	.home-wrap {
		width: 100vw;
		height: 100%;
		background-color: transparent;
		margin: 0;
		padding: 0;
		padding-top: 50px;
		padding-bottom: 15px;
	}
</style>
