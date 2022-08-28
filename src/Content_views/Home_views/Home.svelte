<style>
    .home-wrap {
        overflow-y: auto;
        width: 90%;
        height: 100%;
        background-color: white;
        margin: 0;
        padding: 0;
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-snap-type: y mandatory
    }
    
    .home-wrap::-webkit-scrollbar {
        display: none;
    }
    
    .home-container {
        width: 100%;
        height: 500px;
        background-color: transparent;
        padding: 0;
        margin: 0;
        border-bottom: solid #59545f;
        border-bottom-width: thin;
        scroll-snap-align: center;
    }
</style>


<div class="home-wrap">
    <div class="home-container">
    </div>
    <div class="home-container"></div>
    <div class="home-container"></div>
</div>