import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../../assets/logo.png'
import { StyledLink } from '../../utils/style/Atoms'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../utils/context/user'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const HomeLogo = styled.img`
  height: 80px;
  padding-bottom: 8px;
`

const NavContainer = styled.nav`
  border-bottom: solid 3px #ffd7d7;
`
const Menu = styled.div`
  display: contents;
`

function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setIsAuthenticated } = useContext(UserContext)
  const [isToDisplay, setIsToDisplay] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [isActiveSecond, setIsActiveSecond] = useState(false)

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
    if (user.length != 0) {
      setIsToDisplay(true)
    } else {
      setIsToDisplay(false)
    }
  }, [user])

  function handleLogout() {
    setIsActive(true)
    setIsActiveSecond(false)
    setIsToDisplay(false)
    setIsAuthenticated(false)
    localStorage.clear()
    navigate('/signin')
  }

  return (
    <NavContainer>
      <Navbar collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand>
            {isAuthenticated ? (
              <Link to="/">
                <HomeLogo src={logo} />
              </Link>
            ) : (
              <Link to="/signin">
                <HomeLogo src={logo} />
              </Link>
            )}
          </Navbar.Brand>
          {isToDisplay ? (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                  <Nav.Link>
                    <StyledLink
                      to="/"
                      $isActive={isActive}
                      onClick={() => handleClick('first')}
                    >
                      Accueil
                    </StyledLink>
                  </Nav.Link>
                  <Nav.Link>
                    <StyledLink
                      to="/myposts"
                      $isActive={isActiveSecond}
                      onClick={() => handleClick('second')}
                    >
                      Mes postes
                    </StyledLink>
                  </Nav.Link>
                  <NavDropdown title={user.name} id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">
                      {user.name}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      eventKey="4.2"
                      onClick={() => handleLogout()}
                    >
                      Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : null}
        </Container>
      </Navbar>
    </NavContainer>
    /*<NavContainer>
            {isAuthenticated ? (
                    <Link to="/">
                        <HomeLogo src={logo}/>
                    </Link>
                ) :
                (
                    <Link to="/signin">
                        <HomeLogo src={logo}/>
                    </Link>
                )
            }
            {isToDisplay ? (
                <Menu>
                    <div>
                        <StyledLink
                            to="/"
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
                    <NavDropdown title={user.name} id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1">{user.name}</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item eventKey="4.2" onClick={() => handleLogout()}>
                            Déconnexion
                        </NavDropdown.Item>
                    </NavDropdown>
                </Menu>
            ) : null}
        </NavContainer>*/
  )
}

export default Header
