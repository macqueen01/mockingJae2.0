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
    .posting-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content:space-between;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
    }
    
    h2 {
        font-family: popRegular;
        font-size: 25px;
        padding: 0;
        margin: 0;
        margin-bottom: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    
    h3 {
        font-family: popRegular;
        font-size: 13px;
        padding: 0;
        margin: 0;
        margin-bottom: 23px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    
    .btn-container {
        height: 48px;
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        margin-top: 20px;
    }
    
    .btn-approve {
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
        border: thin solid #59545f;
        position: relative;
    }
    
    .btn-abort {
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
        border: thin solid #413c47;
        position: relative;
    }
    
    .global-icon {
        position: absolute;
        left: 13px;
        top: auto;
        bottom: auto;
    }



</style>

<script>

    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    import SetTitle from "./PostComponents/SetTitle.svelte";
    import SetFile from "./PostComponents/SetFile.svelte";

    

    let _title = "";
    let _file = "";
    let _created_at = "";
    let _crafter = "";
    let is_local = false;
    
    var dispatch = createEventDispatcher();
    
    // stage starts from 0 to 3 where stage 3 sends POST request
    // to the server with the info gathered through stage 0 to 2.
    // initialized at stage 0.
    $: stage = 0;
    

    function resetTitle(e) {
        _title = e.detail.title;
        stage = e.detail.stage;
        console.log("title reset:", _title);
    }
    
    function resetFile(e) {
        // if is_local is true, file recieved comes from Jae service.
        _file = e.detail.file;
        stage = e.detail.stage;
        is_local = e.detail.is_local;
        console.log("file reset:", _file,"on local:", is_local);
    }
    
    function approvalHandle() {
        // send HTTP Request to server while redirect user to 
        // the original post.
    }
    
    function abortHandle() {
        // take user to stage 1 where they can either restart
        // the proceedure or redirect themselves to the original post
        // they came from.
        stage = 0;
    }

    

</script>

<div class="content-wrap" transition:fade={{delay: 300, duration:400, opacity: 0}}>
    <div class="posting-container">
        {#if stage == 0}
            <SetFile on:postFile={resetFile} file={_file} stage={stage} is_local={is_local}/>
        {:else if stage == 1}
            <SetTitle on:postTitle={resetTitle} title={_title} stage={stage} />
        {:else if stage == 2}
            <h2>Finally!</h2>
            <h3>Your Approval to memefy</h3>
            <div class="btn-container">
                <div class="btn-approve" on:click={approveHandle}>
                    <img class="global-icon" src="/icons/svgs/Global_panel.svg" height="13px">
                    Memefy
                </div>
            </div>
            
            <div class="btn-container">
                <div class="btn-abort" on:click={abortHandle}>
                    Abort
                </div>
            </div>
        {/if}
    </div>
</div>