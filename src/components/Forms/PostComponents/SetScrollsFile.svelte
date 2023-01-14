<script>
  import BlockerType from '$lib/Buttons/BlockerTape.svelte';

  import MemehouseMenu from '$lib/Forms/PostComponents/MemehouseMenu.svelte';

    import { onMount } from "svelte";

    export let stage = 0;
    // let FILE be either of two forms:
    //      - a file object passed from file input.
    //        This case, is_local should be set false
    //      - a customed meme object with attributes described bellow.
    //        This case, is_local should be set true
    //              @ id: id of meme uniquely set                    (INT)
    //              @ thumbnail: file object                         (FILE)
    //              @ title: title of the meme                       (STR)
    //              @ crafter: id of User created the meme           (INT)
    //              @ approved: if meme object is approved by Jae    (BOOL)
    //              @ src: source of the file object                 (STR)
    export let file;

    export let is_local = false;
    let memes = [];
    let meme_selected_index;
    let meme_selected_id;
    let preview_src = "";

    for (let i = 0; i < 10; i++) {
        memes.push({
            id: i,
            thumbnail: "HI",
            title: "This is title of meme",
            crafter: "Jae",
            approved: true,
            src: "/icons/svgs/Global_panel.svg",
        });
    }
    console.log(memes);

    onMount(() => {
        if (memes) {
            meme_selected_index = 0;
            meme_selected_id = memes[0].id;
        }
    });

    $: {
        if (meme_house_open && memes) {
            let meme_selected_index = 0;
            let meme_selected_id = memes[0].id;
        }
    }

    $: {
        if (file && !is_local) {
            preview_src = URL.createObjectURL(file[0]);
        } else if (file && is_local) {
            preview_src = file.src;
        }
    }

    let meme_house_open = false;

    import { createEventDispatcher } from "svelte";
    import { slide, fade, draw } from "svelte/transition";
    import { quintOut, quintIn } from "svelte/easing";

    var dispatch = createEventDispatcher();

    function bubbleUpFile() {
        console.log("bubble up file...");
        stage = 1;
        dispatch("postFile", {
            file: file,
            stage: stage,
            is_local: is_local,
        });
    }

    function callToMemeHouse() {
        meme_house_open = true;
        console.log("clicked!", meme_house_open);
    }

    function selectMeme(index, meme_id) {
        if (memes[index].id != meme_id) {
            console.log(
                "error: the id of passed meme and id of selected meme is different:",
                memes[index].id,
                meme_id
            );
        } else {
            meme_selected_index = index;
            meme_selected_id = meme_id;
            console.log("id matches:", meme_id, memes[index].id);
        }
    }

    function initHandler() {
        if (!is_local) {
            URL.revokeObjectURL(preview_src);
            preview_src = "";
        } else {
            is_local = false;
        }
        file = null;
    }
</script>

{#if meme_house_open}
    <MemehouseMenu></MemehouseMenu>
{/if}

<div class="set-post-file-wrap">
    <div class="container">
        <div class="questionair-container">
            {#if !file}
                <h2>Share your creativity</h2>
            {:else}
                <h2>Such Memeful Beauty!</h2>
            {/if}
        </div>

        {#if file}
            <div class="preview-meme">
                <img src={preview_src} width="150px" height="150px" />
            </div>
        {:else}
            <div class="form-wrap">
                <div class="upload-wrap">
                    Choose from
                    <div class="btn-container">
                        <label
                            class="upload-btn-from-device"
                            for="file"
                            on:click={initHandler}
                        >
                            <h4 class="label-device">Gallery</h4>
                        </label>
                    </div>
                    <div class="btn-container">
                        <!--Only under current version-->
                        <BlockerType></BlockerType>
                        <!--Only under current version-->
                        <div
                            class="upload-btn-from-memehouse"
                            on:click={callToMemeHouse}
                        >
                            <label class="label-memehouse"> Meme House </label>
                        </div>
                    </div>
                </div>
                <div class="field-wrap">
                    <input
                        id="file"
                        type="file"
                        name="file"
                        class="file-field"
                        bind:files={file}
                    />
                </div>
            </div>
        {/if}
    </div>
</div>

<div class="sub-navbar-wrap">
    <div class="sub-navbar-left">
        {#if file}
            <button class="nav-left" on:click={initHandler} />
        {/if}
    </div>
    <div class="sub-navbar-right">
        {#if stage == 0 && file}
            <button class="nav-right" on:click={bubbleUpFile} />
        {/if}
    </div>
</div>

<style>
    .set-post-file-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 80%;
        margin: 0;
        padding: 0;
    }

    .sub-navbar-wrap {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .sub-navbar-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .sub-navbar-right {
        transform: scaleX(-1);
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .nav-left,
    .nav-right {
        background-image: url("/icons/svgs/arrowToLeft.svg");
        background-size: cover;
        background-color: transparent;
        border: none;
        height: 50px;
        width: 50px;
    }

    .nav-left:active,
    .nav-right:active {
        background-color: transparent;
        border: none;
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .field-wrap {
        width: fit-content;
        height: fit-content;
        display: flex hidden;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        background-color: transparent;
    }

    .form-wrap {
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .questionair-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 80%;
        height: 40%;
        font-size: 20px;
        text-align: center;
    }

    .file-field {
        display: none;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 20px;
        font-family: popRegular;
    }

    :global(h1) {
        font-family: popRegular;
        font-size: 25px;
        color: gray;
    }

    :global(h2) {
        font-family: popRegular;
        font-size: 20px;
    }

    .upload-wrap {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: popRegular;
        font-size: 14px;
    }

    .btn-container {
        height: 30%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-top: 20px;
        position: relative;
    }

    .upload-btn-from-device {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #413c47;
        color: rgb(224, 221, 221);
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        
    }

    .upload-btn-from-memehouse {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fdf9e6;
        color: #413c47;
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        border: thin solid #59545f;
    }

</style>
