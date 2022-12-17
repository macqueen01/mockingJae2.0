<script>
	import { onMount } from 'svelte';
	import { disableScrollHandler } from '$app/navigation';
    import { TweenMax, Linear } from 'gsap'; 
	import { ScrollMagic } from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic';
    import * as fs from 'fs';

	export let src = '';
	export let alt = '';
	export let dir = '/sequences/rocket_sequence/rocket';

    onMount(() => {
        src = imgs[0];
    })

	let base_sequence_dir = '/sequences/rocket_sequence';
    let height = 300000;
	let length = fs.readdirSync(dir).length;

    const imgs = Array(length)
        .fill('')
        .map((_, index) => `${dir}${index + 1}.png`);
    
    var obj = { curImg: 0 };

    var tween = TweenMax.to(
        obj,
        0.5,
        {
            curImg: imgs.length - 1,
            roundProps: "curImg",
            repeat: 1,
            immediateRender: true,
            ease: Linear.easeNone,
            onUpdate: updateSrc
        }
    );

    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({triggerElement: "#trigger", duration: height})
        .setTween(tween)
        .addIndicators()
        .addTo(controller);


    function updateSrc() {
        src = imgs[obj.curImg];
    }



</script>

<div class="home-wrap">
	<div class="scroll-view">
		<div class="trigger" id="trigger" />
		<div class="sequence-wrap" style='--height: {height};'>
			<div class="img-container">
				<img {src} {alt} id="sequence" width="100%"/>
			</div>
		</div>
	</div>
</div>

<style>
	.home-wrap {
		width: 100vw;
		height: fit-content;
		background-color: transparent;
		margin: 0;
		padding: 0;
		padding-top: 50px;
		padding-bottom: 15px;
	}

	.scroll-view {
		height: 100%;
		width: 100%;
		top: 50%;
		position: sticky;
	}

    .img-container {
        height: fit-content;
        width: 100%;
    }

	.sequence-wrap {
		width: 100%;
		height: calc( var(--height) * 1px );
	}
</style>
