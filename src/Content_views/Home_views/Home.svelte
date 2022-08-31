<style>
    .home-wrap {
        width: 100vw;
        height: fit-content;
        background-color: transparent;
        margin: 0;
        padding: 0;
        padding-top: 50px;
        padding-bottom: 15px;
    }
    
    .date-line-container {
        display: flex;
        flex-direction: row;
        justify-content: start;
        width: 100%;
        height: 50px;
    }
    
    .refresher {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
    }
    
    .refresher-inner-wrap {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        width: 200px;
        padding-bottom: 50px;
    }
    
    .pizza-spinner-refresh {
        animation: rotation 2s infinite linear;
    }
    
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        } to {
            transform: rotate(359deg);
        }
    }
    
    .pull-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
    }
    
    .date-line-wrap {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        width: 200px;
    }
    
    
    .date-line {
        color: white;
        margin-left: 7px;
        font-family: popExtraLight;
        font-size: 13px;
    }
    
    
    .pull-wrap {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        width: 200px;
    }
    
    
    .pull-line {
        color: white;
        margin-left: 7px;
        font-family: popExtraLight;
        font-size: 13px;
    }
    
</style>

<script>
    import { onMount } from 'svelte';
    import Frame from './Frame.svelte'

    
    let blogger = "jae"
    let title = "When you went seoul and saw mom and dad having sex"
    let memes = {}
    let blog = "/icons/svgs/Global_panel.svg"
    let date = "4 hours ago"
    $: height_from_bottom = 10000;
    $: refresh = false;
    let HOME;
    let height;
    
    onMount(() => {
        height = HOME.offsetHeight;
    })         
    
    function updateHandler(e) {
        if (HOME) {
            height_from_bottom = height - window.scrollY
        }
    }
    
    $: {
        // loading while loads more blogs
        // fetches blogs from server then updates HOME
        if (height_from_bottom <= 840 && !refresh) {
            refresh = true;
            height_from_bottom = 1000;
            setTimeout(() => {
                window.scrollTo(0, height - 900)
                refresh = false;
            }, 3000)
        }
    
    }


</script>


<div class="home-wrap" on:wheel={updateHandler} on:touchmove={updateHandler} bind:this={HOME}>
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    
    <div class="date-line-container">
        <div class="date-line-wrap">
            <img src="/icons/svgs/DATE_word.svg" height="9px">
            <h4 class="date-line">- June. 3. 2020<h4>
        </div>
    </div>
    
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />


    <div class="date-line-container">
        <div class="date-line-wrap">
            <img src="/icons/svgs/DATE_word.svg" height="9px">
            <h4 class="date-line">- June. 4. 2020<h4>
        </div>
    </div>
    
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />
    <Frame blogger={blogger} title={title} date={date} memes={memes} blog={blog} />


    {#if !refresh}
        <div class="pull-container">
            <div class="pull-wrap">
                <h4 class="pull-line">Pull to load more<h4>
            </div>
        </div>
    {:else if refresh}
        <div class="refresher">
            <div class="refresher-inner-wrap">
                <img src="/icons/svgs/pizzaSpinner.svg" height="25" width="25" class="pizza-spinner-refresh">
            </div>
        </div>
    {/if}
    
</div>