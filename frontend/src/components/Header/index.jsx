import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../../assets/logo.png'
import { StyledLink } from '../../utils/style/Atoms'
import { NavDropdown } from 'react-bootstrap'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../utils/context/user'

const HomeLogo = styled.img`
  height: 50px;
  padding-bottom: 8px;
`

const NavContainer = styled.nav`
  padding: 0px 30px 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 3px #ffd7d7;
`
const Menu = styled.div`
  display: contents;
`

function Header() {
  const navigate = useNavigate()
  const { setUser, user } = useContext(UserContext)
  const [isToDisplay, setIsToDisplay] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [isActiveSecond, setIsActiveSecond] = useState(false)
  const [userName, setUserName] = useState('')

  function handleClick(current) {
    if (current == 'first') {
      setIsActive(true)
      setIsActiveSecond(false)
    } else {
      setIsActive(false)
      setIsActiveSecond(true)
    }
  }

  useEffect(() => {
    const hours = 24
    const now = new Date().getTime()
    const setupTime = localStorage.getItem('setupTime')
    if (setupTime === null || now - setupTime > hours * 60 * 60 * 1000) {
      localStorage.clear()
      navigate('/signin')
    }
    //console.log(user.length)
    if (user.length !== 0) {
      //console.log(user.name)
      //const userObj = JSON.parse(user)
      //console.log(userObj)
      //setUserName(userObj.name)
      setIsToDisplay(true)
    } else {
      setIsToDisplay(false)
    }
  }, [user])

  function handleLogout() {
    setIsActive(true)
    setIsActiveSecond(false)
    setIsToDisplay(false)
    localStorage.clear()
    navigate('/signin')
  }

  return (
    <NavContainer>
      <Link to="/">
        <HomeLogo src={logo} />
      </Link>
      {isToDisplay ? (
        <Menu>
          <div>
            <StyledLink
              to="/posts"
              $isActive={isActive}
              onClick={() => handleClick('first')}
            >
              Accueil
            </StyledLink>
            <StyledLink
              to="/myposts"
              $isActive={isActiveSecond}
              onClick={() => handleClick('second')}
            >
              Mes postes
            </StyledLink>
          </div>
          <NavDropdown title="Ines Omri" id="nav-dropdown">
            <NavDropdown.Item eventKey="4.1">Ines Omri</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item eventKey="4.2" onClick={() => handleLogout()}>
              Déconnexion
            </NavDropdown.Item>
          </NavDropdown>
        </Menu>
      ) : null}
    </NavContainer>
  )
}

export default Header
