import logo from '../assets/logo.png'
import  '../styles/Header.css'

function Header() {
    return (
        <div className='lmj-header'>
            <img src={logo} alt='Groupomaia' className='lmj-logo' />
        </div>
    )
  }
  
  export default Header