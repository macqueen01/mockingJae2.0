<script>
    import { createEventDispatcher } from "svelte";
    import ScrollComponent from "./ScrollComponent.svelte";
    import ScrollLoader from "./ScrollLoader.svelte";
    
    export let src = '';
    export let length;
    export let height;
    export let startY;
    export let goingDown;
    export let scrolls_id;

    let loaded = false;
    let dispatch = createEventDispatcher();

    function loadHandle(e) {
        loaded = e.detail.load
    }

    function reloadHandle(e) {
        dispatch('reload', e.detail);
    }

    function newHandle(e) {
        dispatch('newload', e.detail)
    }

    function rollupHandle(e) {
        dispatch('rollup', e.detail)
    }
</script>

<ScrollLoader {loaded}>
    <div>
        <ScrollComponent
            on:load={loadHandle}
            on:reload|once={reloadHandle}
            on:newload={newHandle}
            on:rollup={rollupHandle}
            {src}
            {length}
            {height}
            {startY}
            {goingDown}
            {scrolls_id}
        />
    </div>
</ScrollLoader>
