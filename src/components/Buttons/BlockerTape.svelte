<script>
</script>

<div class="dev-prevent">
    <div class="sticker">
        <div class="svg-holder">
            <img src="/icons/svgs/cross.svg" alt="" height="30px" />
        </div>
        <h3 class="sticker-warning">under construction</h3>
    </div>
</div>

<style>
    :global(h1) {
        font-family: popRegular;
        font-size: 25px;
        color: gray;
    }

    :global(h2) {
        font-family: popRegular;
        font-size: 20px;
    }

    .dev-prevent {
        width: 80%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.4);
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(3px);
    }

    .sticker {
        rotate: -0.3rad;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .sticker-warning {
        font-size: 12px;
        color: #fa0505;
    }
</style>
