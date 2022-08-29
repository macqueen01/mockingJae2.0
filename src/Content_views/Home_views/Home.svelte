<style>
    .home-wrap {
        width: 330px;
        height: fit-content;
        background-color: transparent;
        margin: 0;
        padding: 0;
        padding-top: 40px;
        padding-bottom: 50px;
    }
    
    
    .home-container {
        width: 100%;
        min-height: 500px;
        background-color: whitesmoke;
        padding: 0;
        margin: 0;
        
    }
    
    .blog-header {
      width: 100%;
      height: 70px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;
      background-color: white;
    }
    
    .blogger {
        width: 44px;
        height: 44px;
        border-radius: 22px;
        background-color: whitesmoke;
        margin: 0;
    padding: 0;
        margin-left: 15px;
    }
    
    .title-date-container {
        width: 260px;
        height: 100%;
        background-color: whitesmoke;
    }
    
    .blog {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 330px;
      background-color: transparent;
    }
    
    .memes {
      width: 100%;
      min-height: 100px;
      background-color: white;
    }
    
    .sample {
        height: 100%;
        width: 100%;
    }
    
    .date-line-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
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
        font-family: popLight;
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
    <div class="home-container">
      <div class="blog-header">
          <div class="blogger">
          </div>
          <div class="title-date-container">
              <div class="title-wrap">
              </div>
              <div class="date-wrap">
              </div> 
          </div>
      </div>
      <div class="blog">
          <img src="/icons/svgs/Global_panel.svg" class="sample">
      </div>
      <div class="memes"></div>
    </div>
    
    <div class="date-line-container">
        <div class="date-line-wrap">
            <img src="/icons/svgs/DATE_word.svg" height="9px">
            <h4 class="date-line">- June. 3. 2020<h4>
        </div>
    </div>
    
    <div class="home-container">
      <div class="blog-header">
          <div class="blogger">
          </div>
          <div class="title-date-container">
              <div class="title-wrap">
              </div>
              <div class="date-wrap">
              </div> 
          </div>
      </div>
    </div>
    <div class="home-container"></div>
</div>