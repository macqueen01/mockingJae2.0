<script>
    


</script>

<style>

    :global(html) {
        height: 100%;
    }
    
    :global(*) {
        padding: 0;
        margin: 0;
    }

    .navbar {
        display: flex;
        position: fixed;
        justify-content: space-between;
        align-items: center;
        background-color: #fefff0;
        height: 90px;
        padding-top: 25;
        border-bottom: solid #EAE3D2;
        width: 100%;
        align-content: center;

        
    }
    
    
    .menu-wrap {
        display: flex;
        justify-items: baseline;
        justify-content: flex-end;
        margin-right: 20px;
        gap: 20px;
        width: 100%;
        flex-direction: row;
    }
    
    .home, .global, .gift {
        display: inline-block;
    }
    
    .logo-wrap {
        margin-left: 20px;
    }
    
    

</style>


<div class="navbar">
    <div class="logo-wrap">
        <img src="public/icons/Me.png" height="45">
    </div>
    <div class="menu-wrap">
        <div class="home">
            <img src="public/icons/Home.png" height="40">
        </div>
        <div class="global">
            <img src="public/icons/Global.png" height="40">
        </div>
        <div class="gift">
            <img src="public/icons/Dm.png" height="40">
        </div>
    </div>
</div>


