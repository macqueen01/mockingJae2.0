<script>
  import SubMemes from './SubMemes.svelte';

  import BlogHeader from './BlogHeader.svelte';

	import { beforeUpdate, onMount } from 'svelte';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
    import BlogMain from "./BlogMain.svelte";

	export let blogger = 'Jae';
	export let title = 'mocking jae mocking jay';
	export let memes = [1, 2, 3, 4];
	export let blog = '/icons/svgs/Global_panel.svg';
	export let date = '2022.12.12';
	export let meme_id = 1;

	let TITLE;
	let EXTENDEDTITLE;
    let y_position;
	var dispatch = createEventDispatcher();

	$: first = false;
	$: second = false;
	$: third = false;
	$: forth = false;
	$: add_mode = false;

	$: visible = false;


	function bubbleUpAddMode() {
		dispatch('add-meme', {
			meme_id: meme_id,
			add_mode: true
		});
	}

    function positionBubbleUp() {
        console.log(y_position);
    }
</script>


<svelte:window bind:scrollY={y_position} />

<div class="home-container">
    <BlogMain {blog}>
        <div slot="blog-header"><BlogHeader {blogger} {title} {memes} {date}/></div>		
        <div slot="blog-memes"><SubMemes {add_mode}/></div>
    </BlogMain>
</div>

<style>
	.home-container {
		width: 100%;
		min-height: 170vw;
		background-color: whitesmoke;
		padding: 0;
		margin: 0;
	}
</style>
