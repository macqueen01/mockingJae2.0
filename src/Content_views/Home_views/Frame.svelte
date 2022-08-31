

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
    
    .first-meme {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
        background-color: blue;
    }
    
    .second-meme {
        grid-column: 3 / 4;
        grid-row: 1 / 2;
        background-color: red;
    }
    
    .third-meme {
        grid-column: 4 / 5;
        grid-row: 1 / 2;
        background-color: black;
    }
    
    .forth-meme {
        gird-column: 3 / 4;
        grid-row: 2 / 3;
        background-color: gray;
    }
    
    .add-meme {
        grid-column: 4 / 5;
        grid-row: 2 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
        
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
    
    .extended-title-hidden {
        position: absolute;
        width: 100vw;
        height: 100%;
        background-color: #242424;
        top: 20vw;
        z-index: 6;
        display: none;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .extended-title-visible {
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

    
</style>


<script>
    import { onMount } from 'svelte';
    export let blogger = "Jae";
    export let title = "mocking jae mocking jay";
    export let memes = {};
    export let blog = "/icons/svgs/Global_panel.svg";
    export let date = "2022.12.12";
    
    
    let TITLE;
    let EXTENDEDTITLE;
    $: visible = false;
    
    onMount(() => {
        if (title.length >= 30) {
            TITLE.innerHTML = title.slice(0, 30) + '...';
        } else {
            TITLE.innerHTML = title;
        }
    })
    
    function titleExtend() {
        if (!visible) {
            visible = true;
            setTimeout(() => {
                visible = false;
            }, 9000)
        }
    }

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
                <div class="title-wrap" on:click={titleExtend}>
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
        <div class={visible ? 'extended-title-visible' : 'extended-title-hidden'}>
            <h3 class="title">{title}</h3>
        </div>
    </div>
    <div class="blog">
        <img src={blog} class="sample">
        </div>
    <div class="memes">
        <div class="first-meme">
        </div>
        <div class="second-meme">
        </div>
        <div class="third-meme">
        </div>
        <div class="forth-meme">
        </div>
        <div class="add-meme">
            <img src="/icons/svgs/addWithOutBorder.svg" height="40">
        </div>
    </div>
</div>