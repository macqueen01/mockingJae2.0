

<style>
    
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
    

    
</style>


<script>
    export let blogger = "Jae";
    export let title = "mocking jae mocking jay"
    export let memes = {}
    export let blog = "/icons/svgs/Global_panel.svg"
    export let date = "2022.12.12"
</script>






<div class="home-container">
    <div class="blog-header">
        <div class="blogger">
            {blogger}
        </div>
        <div class="title-date-container">
            <div class="title-wrap">
                {title}
            </div>
            <div class="date-wrap">
                {date}
            </div> 
        </div>
    </div>
    <div class="blog">
        <img src={blog} class="sample">
        </div>
    <div class="memes">
        "{memes}"
    </div>
</div>