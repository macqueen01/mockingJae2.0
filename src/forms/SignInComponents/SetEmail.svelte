<script>
    export let stage = 1;
    export let email;

    import { createEventDispatcher } from 'svelte';
    
    var dispatch = createEventDispatcher();

    function bubbleUpEmail() {
        console.log("bubble up email...")
        stage = 2; 
        dispatch('userEmail', {
            email: email,
            stage: stage
        });
    }
    
    function goBack() {
        console.log("Go back to stage", stage-1);
        stage = stage - 1;
        dispatch('userEmail', {
            email: email,
            stage: stage
        })
    }

    
    $: email_rule_result = false;    
    
    function email_rule(email) {
        let rule = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
        let email_regex_result = rule.test(email);
        email_rule_result = email_regex_result;
    }

    $: {
        email_rule(email);
        console.log("email:", email);
        console.log("email rule result:", email_rule_result);
    }

</script>

<style>

    
    .set-user-email-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 80%;
        margin: 0;
        padding: 0;
    }
    
    .sub-navbar-wrap {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
         
    }
    
    .sub-navbar-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .sub-navbar-right {
        transform: scaleX(-1);
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .nav-left, .nav-right {
        background-image: url('/icons/arrowToLeft.png');
        background-size: cover;
        background-color: transparent;
        border: none;
        height: 50px;
        width: 50px;      
    }
    
    .nav-left:active, .nav-right:active {
        background-color: transparent;
        border: none;
    }
    
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width :100%;
        margin: 0;
        padding: 0;
        
    }
    
    .email-field, .email-field:focus {
        background-color: transparent;
        border: none;
        outline: none;
    }
    
    .field-wrap {
        width: fit-content;
        height: fit-content;
        display: flex hidden;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        background-color: transparent;
        
    }
    
    .form-wrap {
        width: fit-content;
        height: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .questionair-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 65%;
        height: 40%;
        text-align: center;
    }
    
    .email-field {
        display: hidden;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 15px;
        font-family: popRegular;
    }
    
    .email-requirement-container {
        width: 60%;
        height: 150px;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    p {
        font-family: latoRegular;
        font-size: 13px;
        padding: 0;
        margin: 0;
        padding-left: 3px;
        padding-bottom: 20px;
    }
    
    
    .requirement-wrap {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        color: red;
    }
    
    .icon-wrap {
        height: 100%;
        width: fit-content;
        padding-right: 5px;
    }

    .requirement-wrap-check {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        color: #3acc37;
    }
    

</style>



<div class="set-user-email-wrap">
    <div class="container">
        <div class="questionair-container">
             {#if email == ""}
                <h2>What email address do you use?</h2>
             {:else if email_rule_result}
                <h2>You sure this is your email?</h2>
            {:else}
                <h2>Email is not valid enough...</h2>
            {/if}
        </div>
       
        <div class="form-wrap">
            <div class="field-wrap">
                <input id="email" name="email" class="email-field" bind:value={email}>
                        
            </div>
            <img src="/icons/crop_bar.png" height="4" width="200">
            
        </div>
        <div class="email-requirement-container">
            {#if !email_rule_result}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>This is not a valid email format.</p>
                </div>
            {/if}
            {#if email_rule_result}
                <div class="requirement-wrap-check">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/check.svg" width="13px" height="13px">
                    </div>
                    <p>Good to go!</p>
                </div>
            {/if}
        </div>
    </div>
            
</div>
<div class="sub-navbar-wrap">
    <div class="sub-navbar-left">
        {#if stage != 0}
            <button class="nav-left" on:click|once={goBack}></button> 
        {/if}
    </div>
    <div class="sub-navbar-right">
        {#if (stage == 1) && (email != "") && email_rule_result}
            <button class="nav-right" on:click|once={bubbleUpEmail}></button>
        {/if}
    </div>
</div>