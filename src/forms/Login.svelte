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
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .login-title {
        /* places the title center horizontally and places it top of the login-container vertically */
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        margin: 0;
        padding: 0;
        padding-top: 65px;
        

    }
    
    .login-divider {
      width: 65%;
      margin: auto;
      padding: auto;
      margin-top: 40px;
      height: 2px;
      border-width: 0;
      color: gray;
      background-color: gray;
    }

    /* style of login form. sections login-wrap and login-form with subtle line */
    .login-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .login {
        width: 100%;
        height: 100%;

    }

    .login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 70%;
        margin: 0;
        padding: 0;
        
    }
    
    .actions {
        width: 100%;
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .login-button-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        
    }
    
    .or {
        width: 100%;
        padding-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    
    .first, .second {
        width: 30%;
        margin: auto;
        padding: auto;
        height: 2px;
        border-width: 0;
        color: gray;
        background-color: gray;
        
        
    }
    
    .middle {
        display: flex;
        justify-content: center;
        font-family: latoRegular;
        letter-spacing: 6.5px;
        font-size: 15px;
        color: gray;
        text-align: center;
    }
    
    .signin-button-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    
    .login-button {

        width: 100%;
        height: 80%;
                
    }

</style>


<div class="content-wrap">
    <div class="login-container">
            <div class="login-wrap">
            <div class="login">
                <div class="login-title">
                    <img src="/icons/Jae.png" height="55">
                </div>
                <hr class="login-divider">
                <div class="login-form">
                    <form action="/login" method="POST">
                        <div class="login-input">
                            <input type="text" name="username" placeholder="Your phone number or email">
                        </div>
                        <div class="login-input">
                            <input type="password" name="password" placeholder="Password">
                        </div>
                        <div class="actions">
                          <div class="login-button-wrap">
                              
                              <img src="/icons/Box_1.png" height="60" width="110">
                              
                          </div>
                          <div class="or">
                              <hr class="first">
                              <p class="middle">OR</p>
                              <hr class="second">
                          </div>
                          <div class="signin-button-wrap">
                              <img src="/icons/Box_1.png" height="60" width="110">
                          </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>