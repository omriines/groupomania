import {useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from "styled-components"
import {Loader} from "../../utils/style/Atoms"
import {useNavigate} from 'react-router-dom'

const FormSignin = styled.form`
    padding: 32px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
`
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`
const MessageWarning = styled.div`
  color: red;
  text-align: center;
  padding: 32px 0 0 0;
`

function Signup() {
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMailValue, setInputMailValue] = useState('')
    const [inputPasswordValue, setInputPasswordValue] = useState('')
    const [inputNameValue, setInputNameValue] = useState('')
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const navigate = useNavigate()
    const [isCheckError, setIsCheckError] = useState(false)

    function handleInputMail(e) {
        setInputMailValue(e.target.value)
    }

    function handleInputPassword(e) {
        setInputPasswordValue(e.target.value)
    }

    function handleInputName(e) {
        setInputNameValue(e.target.value)
    }

    async function Login() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: inputNameValue, email: inputMailValue, password: inputPasswordValue})
        };
        setDataLoading(true)
        try {
            const response = await fetch('http://localhost:3000/api/user/signup', requestOptions)
            const userDataJson = await response.json()
            console.log(response.status)
            if (response.status === 201) {
                setShouldRedirect(true)
            } else {
                setIsCheckError(true)
            }
        } catch (err) {
            console.log('===== error =====', err)
            setError(true)
        } finally {
            setDataLoading(false)
        }
    }

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    if (shouldRedirect) {
        navigate('/posts')
    }

    return (
        <div>
            {isCheckError ? (
                <MessageWarning>
                    Mail trouvé, Veuillez changer l'email
                </MessageWarning>
            ) : null}
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <FormSignin>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nom:</Form.Label>
                        <Form.Control type="name" placeholder="Nom" value={inputNameValue}
                                      onChange={handleInputName}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Adresse E-mail:</Form.Label>
                        <Form.Control type="email" placeholder="Adresse E-mail" value={inputMailValue}
                                      onChange={handleInputMail}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe:</Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" value={inputPasswordValue}
                                      onChange={handleInputPassword}/>
                    </Form.Group>
                    <Button variant="primary" onClick={() => Login()}>
                        S'inscrire
                    </Button>
                </FormSignin>
            )}
        </div>
    )

}

export default Signup