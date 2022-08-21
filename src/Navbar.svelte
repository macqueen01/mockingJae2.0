<style>
    .navbar {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        border-bottom: thin solid #E6DDC6;
        height: 40px;
        width: 100%;
        background-color: #FEF7DC;
        
    }

    .nav-content-wrap {
        display: flex;
        width: 100%;
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }

    .logo-wrap {
        box-sizing: fit-content;
        width: fit-content;
        align-items: center;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
    }

    .menu-wrap {
        display: inline-flex;
        height:  fit-content;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: auto;
        margin-bottom: auto;
        gap: 10px;
    }




</style>

<div class="navbar">
    <div class="nav-content-wrap">
        <div class="logo-wrap">
            <img src="/icons/svgs/Me.svg" height="30" alt="JAE">
        </div>
        <div class="menu-wrap">
            <div class="home-wrap">
                <img src="/icons/svgs/Home.svg" height="30" alt="home">
            </div>
            <div class="global-wrap">
                <img src="/icons/svgs/Global.svg" height="30" alt="global">
            </div>
            <div class="dm-wrap">
                <img src="/icons/svgs/Dm.svg" height="30" alt="dm">
            </div>       
        </div>
    </div>
</div>