<style>
    .content-wrap {
        width: 300px;
        height: 500px;
        /* minimalistic design of a container with rounded corner and subtle color and shadow. 
        places the container inside this one center */

        border-radius: 2px;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
        background-color: white;
        margin: 0;
        padding: 0;

    }

    /* style of login continer. centers all items inside */
    .signin-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    

    


</style>

<script>

    import SetName from "./SetName.svelte";
    

    let name = "";
    let email = "";
    let password = "";
    let stage = 0;
    

    function resetName(e) {
        name = e.detail.name;
        console.log("name reset:", name)
    }


    

</script>

<div class="content-wrap">
    <div class="signin-container">
        {#if stage == 0}
            <SetName on:userName={resetName} name={name} stage={stage} />
        {/if}
    </div>
    
</div>