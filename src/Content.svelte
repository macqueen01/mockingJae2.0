<script>

</script>



<style>

    .content-wrap {
        display: flex;
        background-color: #fbfcf5;
        width: 100%;
        height: 75%;
        top: -40px;
        left: 0;
        right: 0;
        padding-top: 100px;
    }
    
    .login-wrap {
        display: flex;
        
        width: 100%;
        justify-content: center;
        align-content: center;
    }
    
    .block {
        display: flex;
        margin-top: 3%;
        width: 95%;
        height: 95%;
        align-items: center;
        justify-content: center;
        
    }
    
    .form-wrap {
        display: flex;
        width: 400px;
        height: fit-content;
        
        
        margin-left: auto;
        margin-right: auto;
        
    }
    
    .login-form {
        display: block;
        width: 100%;
        height: 100%;
        justify-items: center;
        align-content: center;
    }
    
    .email-wrap {
        justify-self: center;
        width: 100%;
        border-bottom: solid #EAE3D2;
        height: fit-content;
    }
    
    .email {
        height: 40px;
        padding-top: 10px;
        background-color: transparent;
        border: transparent;
        width: 60%;
        outline: none;
        font-size: 15px;
        margin-left: 10px;
    }
    
    .password-wrap {
        justify-self: center;
        width: 100%;
        height: fit-content;
    }
    
    .password {
        height: 40px;
        padding-top: 10px;
        background-color: transparent;
        border: transparent;
        width: 60%;
        outline: none;
        font-size: 15px;
        margin-left: 10px;
    }
    
    .submit-wrap {
        display: flex;
        width: 100%;
        height: fit-content;
        justify-content: space-evenly;
        margin-left: auto;
        margin-right: auto;
        padding-top: 10px;
    }
    
    .email-password-wrap {
        height: fit-content;
        width: 100%;
        border-radius: 15px;
        border: solid #EAE3D2;
    }
    

    
    
    
    
 
    

    
    
</style>

<div class="content-wrap">
    <div class="login-wrap">
        <div class="block">
            <div class="form-wrap">
                <form class="login-form" action="#" method="POST">
                    <div class="email-password-wrap">
                        <div class="email-wrap">
                            <input class="email" name="email" placeholder="Your email or phone number">
                        </div>
                        <div class="password-wrap">
                            <input class="password" name="password" placeholder="Password" type="password">
                        </div>   
                    </div> 
                    <div class="submit-wrap">
                        <input class="submit-btn" type="image" src="public/icons/Box_1.png" height="70" width="110">
                        <input class="submit-btn" type="image" src="public/icons/Box_1.png" height="70" width="110">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>