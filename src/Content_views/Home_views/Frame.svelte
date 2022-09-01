

<style>
    
    .home-container {
        width: 100%;
        min-height: 170vw;
        background-color: whitesmoke;
        padding: 0;
        margin: 0;
        
    }
    
    .blog-header {
      width: 100%;
      height: 20vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;
      background-color: white;
      position: relative;
    }
    
    .bloggers {
        width: 100px;
        height: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin: 0;
        padding: 0;
        z-index: 3;
    }
    
    
    .blogger {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background-color: whitesmoke;
        margin: 0;
        padding: 0;
    }
    
    .blogger-default {
        position: relative;
        z-index: 3;
    }
    
    .blogger-company-1 {
        position: absolute;
        left: 40px;
        z-index: 2;
    }
    
    .blogger-company-2 {
        position: absolute;
        z-index: 1;
        left: 60px;
    }
    
    
    .title-date-dm-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 260px;
        height: 100%;
    }
    
    .title-date-wrap {
        width: 75%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    .dm-wrap {
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: end;
    }
    
    .blog {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100vw;
      background-color: transparent;
    }
    
    .memes {
      width: 100%;
      min-height: 50vw;
      display: grid;
      grid-template-columns: 25vw 25vw 25vw 25vw;
      grid-template-rows: 25vw 25vw;
    }
    
    .show-memes {
      width: 100%;
      height: fit-content;
      display: grid;
      grid-template-columns: 50vw 50vw;
    }
    
    .rest-meme {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vw;
        width: 50vw;
        margin: 0;
        padding: 0;
        background-color: beige;
    }
    
    .first-meme {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
        background-color: blue;
        position: relative;
    }
    
    .second-meme {
        grid-column: 3 / 4;
        grid-row: 1 / 2;
        background-color: red;
        position: relative;
    }
    
    .third-meme {
        grid-column: 4 / 5;
        grid-row: 1 / 2;
        background-color: black;
        position: relative;
    }
    
    .forth-meme {
        gird-column: 3 / 4;
        grid-row: 2 / 3;
        background-color: gray;
        position: relative;
    }
    
    .add-meme {
        grid-column: 4 / 5;
        grid-row: 2 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    
    .add-meme-in-show-meme {
        width: 50vw;
        height: 50vw;
        margin: 0;
        padding: 0;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    
    .sample {
        height: 100%;
        width: 100%;
    }
    
    .title-wrap {
        width: 100%;
        height: 75%;
        font-family: popRegular;
        margin: 0;
        padding: 0;
        position: relative;
        
    }
    
    .title-container-long {
        margin: 0;
        padding: 0;
        align-items: center;
        display: flex;
        font-size: 14px;
        text-align: center;
        height: 100%;
        width: 100%;
        margin-top: 5px;
    }
    
    .title-container-short {
        
    }
    
    .date-wrap {
        width: 100%;
        height: 25%;
        font-size: 12px;
        text-align: end;
        color: #8c8c8c;
    }
    
    
    .extended-title {
        position: absolute;
        width: 100vw;
        height: 100%;
        background-color: #242424;
        top: 20vw;
        z-index: 6;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .title {
        width: fit-content;
        height: fit-content;
        text-align: center;
        justify-content: center;
        font-size: 15px;
        font-family: popRegular;
        color: whitesmoke;
    }
    
    
    .meme {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(36, 36, 36, 0.3);
        position: absolute;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        
    }

    
</style>


<script>
    import { onMount } from 'svelte';
    import { fade, fly, slide, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    export let blogger = "Jae";
    export let title = "mocking jae mocking jay";
    export let memes = [1,2,3,4];
    export let blog = "/icons/svgs/Global_panel.svg";
    export let date = "2022.12.12";
    
    
    let TITLE;
    let EXTENDEDTITLE;
    $: first = false;
    $: second = false;
    $: third = false;
    $: forth = false;
    $: add_mode = false;
    
    $: visible = false;
    
    onMount(() => {
        if (title.length >= 30) {
            TITLE.innerHTML = title.slice(0, 30) + '...';
        } else {
            TITLE.innerHTML = title;
        }
    })
    
    
    
    

</script>


<div class="home-container">
    <div class="blog-header">
        <div class="bloggers">
          <div class="blogger-default blogger">
              {blogger}
          </div>
        </div>
        <div class="title-date-dm-container">
            <div class="title-date-wrap">
                <div class="title-wrap" on:click={() => {visible = true; setTimeout(() => {visible = false}, 8000)}}>
                    <div class="title-container-long" bind:this={TITLE}>
                        {title}
                    </div>
                </div>
                <div class="date-wrap">
                    {date}
                </div> 
            </div>
            <div class="dm-wrap">
                DM
            </div>
        </div>
        {#if visible}
            <div class='extended-title' transition:fly={{duration: 300, x: 0, y: 0, opacity: 0}}>
                <h3 class="title">{title}</h3>
            </div>
        {/if}
    </div>
    <div class="blog">
        <img src={blog} class="sample">
    </div>
    {#if add_mode == false} 
    <div class="memes" transition:fade={{duration: 200, easing: quintOut}}>
        <div class="first-meme" on:click={() => {first = true; second = third = forth = false; setTimeout(() => {first = false}, 2000)}}>
            {#if first}
                <div class="meme" transition:fade={{duration: 200}}>
                    <img src="/icons/svgs/Dm.svg" height="30">
                    <a></a>
                </div>
            {/if}
        </div>
        <div class="second-meme" on:click={() => {second = true; first = third = forth = false; setTimeout(() => {second = false}, 2000)}}>
            {#if second}
                <div class="meme" transition:fade={{duration: 200}}>
                    <img src="/icons/svgs/Dm.svg" height="30">
                </div>
            {/if}
        </div>
        <div class="third-meme" on:click={() => {third = true; second = first = forth = false; setTimeout(() => {third = false}, 2000)}}>
            {#if third}
                <div class="meme" transition:fade={{duration: 200}}>
                    <img src="/icons/svgs/Dm.svg" height="30">
                </div>
            {/if}
        </div>
        <div class="forth-meme" on:click={() => {forth = true; second = third = first = false; setTimeout(() => {forth = false}, 2000)}}>
            {#if forth}
                <div class="meme" transition:fade={{duration: 200}}>
                    <img src="/icons/svgs/Dm.svg" height="30">
                </div>
            {/if}
        </div>
        <div class="add-meme">
            <a on:click={() => {add_mode = true;}}>
                <img src="/icons/svgs/addWithOutBorder.svg" height="40">
            </a>
        </div>
    </div>
    {:else}
    <div class="show-memes" transition:slide={{delay:200, duration:400, easing:quintOut}}>
        {#each memes as meme}
            <div class="rest-meme" transition:scale={{delay:600, duration:400, easing:quintOut, start: 0.5, opacity: 0}}>
                {meme}
            </div>
        {:else}
            <div class="no-meme-placeholder">
                <h3>Add a first meme!</h3>
            </div>
        {/each}
        <div class="add-meme-in-show-meme">
            <img src="/icons/svgs/addWithOutBorder.svg" height="40">
        </div>
    </div>
    {/if}
</div>   