<script>
    import { onMount, createEventDispatcher } from "svelte";

    export let active = false;
    export let status = 0;

    $: console.log(active, status)

</script>

<div class="scrolls-header">
    <div class="status-bar-wrap">
        <div class="status-bar" style="--status: {status};"></div>
    </div>
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
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
        overflow: hidden;
    }

    .status-bar-wrap {
        position: absolute;
        top: 0;
        width: 100%;
        height: 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .status-bar {
        height: 100%;
        width: calc(var(--status) * 100vw);
        background-color: #ebe5d1;
        border-radius: 1px;
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
