import  '../styles/Signin.css'
import Signup from './Signup'
import {useEffect} from "react";
function Signin() {
    return (
        <form class="form-login">
        <div class="login">
            <div class="center">
                <h2 class="title">SignIn</h2>
                <div class="form-input">
                    <input type="email" class="input" placeholder="Email" />
                    <input type="password" class="input" placeholder="Password" />
                </div>
                <button class="submit-btn">SignIn</button>
                <a href="#">SignUp</a>
            </div>
        </div>
    </form>
    
    )
  }
  
  export default Signin