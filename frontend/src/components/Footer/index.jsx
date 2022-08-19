import styled from "styled-components";

const FooterContainer = styled.footer`
    color: #FD2D01;
    padding: 32px;
    border-top: solid 3px #FFD7D7;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    margin-top:50px;
`
function Footer() {
    return (
        <FooterContainer>
            ©2022 Groupmania. Tous droits réservés.
        </FooterContainer>
    )
}

export default Footer