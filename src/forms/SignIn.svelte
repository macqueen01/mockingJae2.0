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
    import SetEmail from "./SetEmail.svelte";
    import SetPassword from "./SetPassword.svelte";
    

    let name = "";
    let email = "";
    let password = "";
    $: stage = 0;
    

    function resetName(e) {
        name = e.detail.name;
        stage = e.detail.stage;
        console.log("name reset:", name);
    }
    
    function resetEmail(e) {
        email = e.detail.email;
        stage = e.detail.stage;
        console.log("email reset:", email);
    }

    function resetPassword(e) {
        password = e.detail.password;
        stage = e.detail.stage;
        console.log("password reset:", password);
    }
    

    

</script>

<div class="content-wrap">
    <div class="signin-container">
        {#if stage == 0}
            <SetName on:userName={resetName} name={name} stage={stage} />
        {:else if stage == 1}
            <SetEmail on:userEmail={resetEmail} email={email} stage={stage} />
        {:else if stage == 2}
            <SetPassword on:userPassword={resetPassword} stage={stage} />
        {:else}
            Error
        {/if}
    </div>
</div>