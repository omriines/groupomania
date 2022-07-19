import  '../styles/Signup.css'

function Signin() {
    return (
        <form class="form-login">
        <div class="login">
            <div class="center">
                <h2 class="title">SignUp</h2>
                <div class="form-input">
                    <input type="name" class="input" placeholder="Name" /> 
                    <input type="email" class="input" placeholder="Email" />
                    <input type="password" class="input" placeholder="Password" />
                </div>
                <button class="submit-btn">SignUp</button>
                
            </div>
        </div>
    </form>
    )
  }
  
  export default Signin