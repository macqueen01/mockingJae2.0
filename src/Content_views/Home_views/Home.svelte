<style>
    .home-wrap {
        width: 100vw;
        height: fit-content;
        background-color: transparent;
        margin: 0;
        padding: 0;
        padding-top: 50px;
        padding-bottom: 80px;
    }
    
    
    
    .date-line-container {
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
    
</style>

<script>
    import Frame from './Frame.svelte'
    let blogger = "jae"
    let title = "me"
    let memes = {}
    let blog = "/icons/svgs/Global_panel.svg"
    let date = "2022.12.12"
</script>


<div class="home-wrap">
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


    <div class="date-line-container">
        <div class="date-line-wrap">
            <h4 class="date-line">Pull to add blog<h4>
        </div>
    </div>
    
    
</div>