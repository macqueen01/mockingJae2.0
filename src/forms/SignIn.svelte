<style>
    .content-wrap {
        width: 300px;
        height: 500px;
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
    
    h3 {
        font-family: popLight;
        font-size: 25px;
        padding: 0;
        margin: 0;
        margin-bottom: 10px;
    }

    

    


</style>

<script>

    import { createEventDispatcher } from 'svelte';

    import SetName from "./SignInComponents/SetName.svelte";
    import SetEmail from "./SignInComponents/SetEmail.svelte";
    import SetPassword from "./SignInComponents/SetPassword.svelte";
    

    let name = "";
    let email = "";
    let password = "";
    
    var dispatch = createEventDispatcher();
    
    //stage starts from 0 to 3 where stage 3 sends POST request
    //to the server with the info gathered through stage 0 to 2.
    //initialized at stage 0.
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
    
    function goBackHandler(e) {
        stage = e.detail.stage;
        console.log("going back from password stage")
    }
    
    $: {
        if (stage == 3) {
            setTimeout(() => {
                dispatch('mode', {
                    signIn: false
                })
            }, 5000);
        }
    }

    

</script>

<div class="content-wrap">
    <div class="signin-container">
        {#if stage == 0}
            <SetName on:userName={resetName} name={name} stage={stage} />
        {:else if stage == 1}
            <SetEmail on:userEmail={resetEmail} email={email} stage={stage} />
        {:else if stage == 2}
            <SetPassword on:userPassword={resetPassword} stage={stage} on:goBack={goBackHandler} />
        {:else}
            <h3>WELCOME TO</h3>
            <img src="/icons/svgs/Jae.svg" height="60">
        {/if}
    </div>
</div>