<script>
    export let loaded;
</script>

<div class={loaded ? "scroll-view" : "scroll-view-loading"}>
    <div class="loading" class:loaded>
        <img src="/icons/svgs/Me.svg" height="50" alt="JAE" />
    </div>
    <slot>
        <div class="view" />
    </slot>
</div>

<style>
    .scroll-view {
        width: 100vw;
        position: relative;
        /*
        scroll-margin: 200px;
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        */
    }

    .scroll-view-loading {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow-y: hidden;
        top: 0;
        /*
        scroll-margin: 200px;
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        */
    }

    .loading {
        z-index: 4;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #59545f;
        position: absolute;
        top: 0;
        width: 100vw;
        height: 100vh;
    }

    .loaded {
        display: none;
    }

    .view {
        z-index: 3;
    }
</style>
