<script>
    import { createEventDispatcher } from "svelte";
    import ScrollComponent from "./ScrollComponent.svelte";
    import ScrollLoader from "./ScrollLoader.svelte";
    
    export let src = '';
    export let length;
    export let height;
    export let startY;

    let loaded = false;
    let dispatch = createEventDispatcher();

    function loadHandle(e) {
        loaded = e.detail.load
    }

    function reloadHandle(e) {
        dispatch('reload', e.detail);
    }
</script>

<ScrollLoader {loaded}>
    <div>
        <ScrollComponent
            on:load={loadHandle}
            on:reload|once={reloadHandle}
            {src}
            {length}
            {height}
            {startY}
        />
    </div>
</ScrollLoader>
