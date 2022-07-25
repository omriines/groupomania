import {Link} from "react-router-dom";
import styled from "styled-components";
import logo from '../../assets/logo.png'
const HomeLogo = styled.img`
  height: 100px;
`

const NavContainer = styled.nav`
  padding: 0px 30px 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 3px #FFD7D7;
`

function Header() {
    return (
        <NavContainer>
            <Link to="/">
                <HomeLogo src={logo} />
            </Link>
        </NavContainer>
    )
}

export default Header