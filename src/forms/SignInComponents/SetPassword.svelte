<script>
    export let stage = 2;
    

    import { createEventDispatcher } from 'svelte';
    
    var dispatch = createEventDispatcher();
    
    //if check_password_mode == 0 -> drafting password stage
    //if check_password_mode == 1 -> checking password stage
    //initialized at 0
     
    $: check_password_mode = 0;
    $: password = "";
    $: password_container = "";
    $: password_rule_result = password_rule_detail.has_uppercase && password_rule_detail.long_enough && password_rule_detail.has_specialcase && password_rule_detail.no_whitespace; 
    $: password_rule_detail = {
        has_uppercase: false,
        long_enough: false,
        has_specialcase: false,
        no_whitespace: true
    }


    function bubbleUpPassword() {
        if (stage == 2 && check_password_mode == 0) {
            console.log("password initialized to", password_container);
            password = password_container;
            password_container = "";
            check_password_mode = 1;
        } else if (stage == 2 && check_password_mode == 1) {
            console.log("checking if password matches ...")
            if (password_container == password && password != "") {
                console.log("password matches");
                stage = 3;
                dispatch("userPassword", {
                    password: password,
                    stage: stage
                })
                password_container = "";
            } else {
                console.log("password match failed");
                check_password_mode = 0;
                password_container = "";
                password = "";
            }
        }
    }
    
    function goBack() {
        if (check_password_mode == 0 && stage == 2) {
            console.log("Go back to stage", stage-1);
            stage = stage - 1;
            dispatch('goBack', {
                stage: stage
            })
        } else if (check_password_mode == 1 && stage == 2) {
            console.log("Go back to change the draft password");
            check_password_mode = 0;
            password_container = "";
            password = "";
        } 
    }

       
    
    function password_rule(password) {
        let uppercase_rule = /[A-Z]/;
        let min_rule = password.length >= 9;
        let specialcase_rule = /[^A-Za-z0-9]/;
        let no_whitespace_rule = /\s/;
        let detail = {}
        
        detail.has_uppercase = uppercase_rule.test(password);
        detail.long_enough = min_rule;
        detail.has_specialcase = specialcase_rule.test(password);
        detail.no_whitespace = !no_whitespace_rule.test(password);
        
        password_rule_detail = detail;
    }

    $: {
        password_rule(password_container);
        console.log("password:", password);
        console.log("password rule result:", password_rule_result);  
        password_rule_result = password_rule_detail.has_uppercase && password_rule_detail.long_enough && password_rule_detail.has_specialcase && password_rule_detail.no_whitespace;      
    }

</script>

<style>

    
    .set-user-password-wrap {
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
    
    .password-field, .password-field:focus {
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
    
    .password-field {
        display: hidden;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 12px;
        font-family: popRegular;
    }
    
    .password-requirement-container {
        width: 60%;
        height: 150px;
        position: relative;
        top: -10px;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    p {
        font-family: popRegular;
        font-size: 12px;
        padding: 0;
        margin: 0;
        padding-left: 3px;
        padding-bottom: 13px;
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



<div class="set-user-password-wrap">
    <div class="container">
        <div class="questionair-container">
            {#if check_password_mode == 0}
                {#if password_container == ""}
                    <h2>Set a magic password !</h2>
                {:else if password_rule_result}
                    <h2>Make sure you internalize this magic password</h2>
                {:else}
                    <h2>Password not strong enough ...</h2>
                {/if}
            {:else if check_password_mode == 1}
                {#if password_container == ""}
                    <h2>Now is time to check. Type again !</h2>
                {:else if password == password_container}
                    <h2>LASTLY !</h2>
                {:else}
                    <h2>Password doesn't seem to match ... You sure ?</h2>
                {/if}
            {:else}
                <h2>Mode Error. Something went wrong ...</h2>
            {/if}
        </div>
       
        <div class="form-wrap">
            <div class="field-wrap">
                <input id="password" name="password" class="password-field" bind:value={password_container} type="password">
                        
            </div>
            <img src="/icons/crop_bar.png" height="4" width="200">
            
        </div>
        <div class="password-requirement-container">
            {#if !password_rule_result && !password_rule_detail.has_uppercase}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>You need at least one uppercase.</p>
                </div>
            {/if}
            {#if !password_rule_result && !password_rule_detail.long_enough}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>Password need to be longer than nine characters.</p>
                </div>
            {/if}
            {#if !password_rule_result && !password_rule_detail.has_specialcase}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>You need at least one special case.</p>
                </div>
            {/if}
            {#if !password_rule_result && !password_rule_detail.no_whitespace}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>No whitespace is allowed!</p>
                </div>
            {/if}
            {#if password_rule_result}
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
            <button class="nav-left" on:click={goBack}></button> 
        {/if}
    </div>
    <div class="sub-navbar-right">
        {#if (stage == 2) && (password_container != "") && password_rule_result}
            <button class="nav-right" on:click={bubbleUpPassword}></button>
        {/if}
    </div>
</div>