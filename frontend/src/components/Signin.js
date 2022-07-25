import  '../styles/Signin.css'
import Signup from './Signup'
import {Link} from "react-router-dom";
import React, { useEffect, useState } from 'react';
function Signin() {
    useEffect(() => {
        fetch('http://localhost:3000/api/user/signin')
          .then((response) => console.log(response.json()))
       
      }, []);
    return (
        <form class="form-login">
        <div class="login">
            <div class="center">
                <h2 class="title">SignIn</h2>
                <div class="form-input">
                    <input type="email" class="input" placeholder="Email" />
                    <input type="password" class="input" placeholder="Password" />
                </div>
                <button class="submit-btn"><Link to='/post'>SignIn</Link></button>
                <Link to='/signup'>SignUp</Link>
            </div>
        </div>
    </form>
    
    )
  }
  
  export default Signin