<script>
    import { page } from "$app/stores";
</script>

<div class="wrapper">
    <div class="content-wrap">
        <div class="error-container">
            <h3>Nothing here!</h3>
            <div class="detail-container">
                <h4>You took a wrong path</h4>
                <h4>Want to go back?</h4>
            </div>
        </div>
    </div>
</div>

<style>
    .content-wrap {
        width: 300px;
        height: 500px;
        border-radius: 14px;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
        background-color: white;
        margin: 0;
        padding: 0;
    }

    /* style of login continer. centers all items inside */
    .error-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .detail-container {
        display: flex;
        flex-direction: column;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        top: 50px;
    }

    h3 {
        font-family: popLight;
        font-size: 25px;
        padding: 0;
        margin: 0;
        margin-bottom: 10px;
        width: 80%;
        text-align: center;
        top: 50px;
    }

    h4 {
        font-family: popLight;
        font-size: 20px;
        padding: 0;
        margin: 0;
        margin-bottom: 10px;
        width: 80%;
        text-align: center;
        top: 150px;
    }

</style>
