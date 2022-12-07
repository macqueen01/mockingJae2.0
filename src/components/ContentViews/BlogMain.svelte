<script>
    import sticky from "./sticky";
    import BlogHeader from "./BlogHeader.svelte";
    export let blog

    let stickToTop = true;
    let is_stuck = false;
    
    function stuckHandle(e) {
        is_stuck = e.detail.isStuck;
    }
</script>

<slot name="blog-header">
    <div></div>
</slot>

<div class="image-wrap" class:is_stuck use:sticky={{stickToTop}} on:stuck={stuckHandle}>
    <img src={blog} class="blog-img"/>
</div>

<slot name="blog-memes">
    <div></div>
</slot>

<style>
    .image-wrap {
        position: -webkit-sticky;
        position: sticky;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100vw;
		background-color: white;
        transition: all 0.3s;
        top: 50px;
        z-index: 7;
    }

    .image-wrap.is_stuck {
        width: 50%;
        height: 50vw;
        background-color: white;
 
    }

    .blog-img {
        height: 100%;
        width: 100%;
    }

</style>