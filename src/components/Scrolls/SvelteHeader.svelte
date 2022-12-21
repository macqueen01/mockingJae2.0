<script>
    import { onMount, createEventDispatcher } from "svelte";
</script>

<div class="scrolls-header">
    <div class="header-content">
        <div class="present-holder">
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
</style>
