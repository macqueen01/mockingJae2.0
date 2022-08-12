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
        height: 55%;
        margin: 0;
        padding: 0;
        
    }

</style>


<div class="content-wrap">
    <div class="login-container">
        <div class="login-wrap">
            <div class="login">
                <div class="login-title">
                    <img src="/icons/Jae.png" height="55">
                </div>
                <div class="login-form">
                    <form action="/login" method="POST">
                        <div class="login-input">
                            <input type="text" name="username" placeholder="Your phone number or email">
                        </div>
                        <div class="login-input">
                            <input type="password" name="password" placeholder="Password">
                        </div>
                        <div class="login-button">
                            <input type="submit" value="Login">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>