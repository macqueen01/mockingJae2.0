<script>
    export let stage = 0;
    export let file;
    let title = 0;

    import { createEventDispatcher } from 'svelte';
    
    var dispatch = createEventDispatcher();

    function bubbleUpTitle() {
        console.log("bubble up title...")
        stage = 1; 
        dispatch('postFile', {
            file: file,
            stage: stage
        });
    }



</script>

<style>

    
    .set-post-file-wrap {
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
        background-image: url('/icons/svgs/arrowToLeft.svg');
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
    
    .title-field, .title-field:focus {
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
        width: 100%;
        height: 40%;
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
    
    .file-field {
        display: none;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 20px;
        font-family: popRegular;
    }
    
    .title-requirement-container {
        width: 60%;
        height: 150px;
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
    
    .upload-wrap {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: popRegular;
        font-size: 14px;
    }
    
    .btn-container {
        height: 30%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-top: 20px;
    }

    .upload-btn-from-device {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #413c47;
        color: rgb(224, 221, 221);
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
    }

    .upload-btn-from-memehouse {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fdf9e6;
        color: #413c47;
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        border: thin solid #59545f
    }

</style>



<div class="set-post-file-wrap">
    <div class="container">
        <div class="questionair-container">
             {#if true}
                <h2>Share your piece of meme</h2>
             {:else}
                <h2>Too long for a meme...</h2>
            {/if}
        </div>
       
        <div class="form-wrap">
            <div class="upload-wrap">
                Choose from
                <div class="btn-container">
                    <div class="upload-btn-from-device">
                        <label class="label-device" for="file">
                            Gallery
                        </label>
                    </div>
                </div>
                <div class="btn-container">
                    <div class="upload-btn-from-memehouse">
                        <label class="label-memehouse" for="file">
                            Meme House
                        </label>
                    </div>
                </div>
            </div>
            <div class="field-wrap">
                <input id="file" type="file" name="file" class="file-field" bind:files={file}/>
            </div>
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
        {#if (stage == 0)}
        <button class="nav-right" on:click={bubbleUpFile}></button>
        {/if}
    </div>
</div>