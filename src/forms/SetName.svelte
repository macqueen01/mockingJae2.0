<script>
    export let stage = 0;
    export let name;

    import { createEventDispatcher } from 'svelte';
    
    var dispatch = createEventDispatcher();

    function bubbleUpName() {
        console.log("bubble up name...")
        stage = 1; 
        dispatch('userName', {
            name: name,
            stage: stage
        });
    }

    let name_rule_detail = {
        is_long_enough: false,
        is_short_enough: true,
        no_whitespace: true
    }
    
    let name_rule_result = false;    
    
    function name_rule(name) {
        let whitespace = /\s/;
        let name_regex_result = !whitespace.test(name);
        let min_len = 3;
        let max_len = 10;
        let name_len = name.length;
        let detail = {};
        detail.is_long_enough = name_len >= min_len;
        detail.is_short_enough = name_len <= max_len;
        detail.no_whitespace = name_regex_result;
        name_rule_detail = detail;
        console.log(name)
    }

    $: {
            name_rule(name);
            name_rule_result = name_rule_detail.is_long_enough && name_rule_detail.is_short_enough && name_rule_detail.no_whitespace;
            
    }

</script>

<style>

    
    .set-user-name-wrap {
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
    
    .name-field, .name-field:focus {
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
        font-size: 20px;
        text-align: center;
    }
    
    .name-field {
        display: hidden;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 20px;
        font-family: popRegular;
    }
    
    .name-requirement-container {
        width: 60%;
        height: 150px;
        padding: 0;
        margin: 0;
        margin-top: 10px;
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
    
    :global(h1) {
        font-family: popRegular;
        font-size: 25px;
        color: gray;
    }
    
    :global(h2) {
        font-family: popRegular;
        font-size: 20px;
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



<div class="set-user-name-wrap">
    <div class="container">
        <div class="questionair-container">
             {#if name == ""}
                <h2>What are you called?</h2>
             {:else if name_rule_result}
                <h1>{name}</h1>
                <h2>are you sure?</h2>
            {:else}
                <h2>Name is not valid enough...</h2>
            {/if}
        </div>
       
        <div class="form-wrap">
            <div class="field-wrap">
                <input id="name" name="name" class="name-field" bind:value={name}>
                        
            </div>
            <img src="/icons/crop_bar.png" height="4" width="200">
            
        </div>
        <div class="name-requirement-container">
            {#if !name_rule_detail.is_long_enough}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>Too short! Make it longer than 2 letters.</p>
                </div>
            {/if}
            {#if !name_rule_detail.is_short_enough}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                    <p>Too long! Make it shorter than 11 letters.</p>
                </div>
            {/if}
            {#if !name_rule_detail.no_whitespace}
                <div class="requirement-wrap">
                    <div class="icon-wrap">
                        <img src="/icons/svgs/cross.svg" width="13px" height="13px">
                    </div>
                <p>No whitespace is allowed.</p>
                </div>
            {/if}
            {#if name_rule_result}
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
            <button class="nav-left"></button> 
        {/if}
    </div>
    <div class="sub-navbar-right">
        {#if (stage == 0) && (name != "") && name_rule_result}
        <button class="nav-right" on:click={bubbleUpName}></button>
        {/if}
    </div>
</div>