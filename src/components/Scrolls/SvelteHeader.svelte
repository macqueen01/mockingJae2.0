<script>
    import { onMount, createEventDispatcher } from "svelte";

    export let active = false;

    $: console.log(active)

</script>

<div class="scrolls-header">
    <div class="header-content">
        <div class="present-holder" class:active>
            <a class="dm-wrap" href="/memehouse">
                <img src="/icons/svgs/Dm.svg" height="28" alt="dm" />
            </a>
        </div>
    </div>
</div>

<style>
    .scrolls-header {
        position: absolute;
        width: 100%;
        height: 50px;
        top: 0;
        z-index: 6;
    }

    .header-content {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-left: 120px;
        padding-right: 15px;
        padding-top: 4px;
        flex-direction: row;
        height: 100%;
    }

    .present-holder {
        opacity: 0%;
        transition: all 0.3s;
    }

    .active {
        opacity: 100%;
    }
</style>
