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
    
    .set-user-name-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 80%;
        margin: 0;
        padding: 0;
        border-bottom: thin solid gray;
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
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        background-color: whitesmoke;
        
    }
    
    .form-wrap {
        width: fit-content;
        height: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .questionair-container {
        display: flex;
        justify-content: center;
        align-items: center;
        
        width: 80%;
        height: 40%;
        background-color: whitesmoke;
        
    }
  
    
    


</style>

<script>

    let name = "";
    let email = "";
    let password = "";
    let stage = "name-stage";

</script>

<div class="content-wrap">
    <div class="signin-container">
        <div class="set-user-name-wrap">
        
            <div class="container">
                <div class="questionair-container">
                </div>
               
                <div class="form-wrap">
                    <div class="field-wrap">
                        <input id="name" name="name" class="name-field" bind:value={name}>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="sub-navbar-wrap">
            <div class="sub-navbar-left">
                <button class="nav-left"></button> 
            </div>
            <div class="sub-navbar-right">
                <button class="nav-right"></button>
            </div>
        </div>
    </div>
    
</div>