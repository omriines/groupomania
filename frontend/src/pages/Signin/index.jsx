import {useState, useContext} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import {Loader} from '../../utils/style/Atoms'
import {MessageWarning} from '../../utils/style/Atoms'
import {LoaderWrapper} from '../../utils/style/Atoms'
import {Link, useNavigate} from 'react-router-dom'
import {Alert} from 'react-bootstrap'
import {UserContext} from '../../utils/context/user'
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Title = styled.h1`
  font-size:2.5rem;
  margin-top:30px
`

function Signin() {
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMailValue, setInputMailValue] = useState('')
    const [inputPasswordValue, setInputPasswordValue] = useState('')
    const navigate = useNavigate()
    const [isCheckError, setIsCheckError] = useState(false)
    const {user, authenticateUser} = useContext(UserContext)
    const [validated, setValidated] = useState(false);

    function handleInputMail(e) {
        setInputMailValue(e.target.value)
    }

    function handleInputPassword(e) {
        setInputPasswordValue(e.target.value)
    }

    async function Login() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: inputMailValue,
                password: inputPasswordValue,
            }),
        }
        setDataLoading(true)
        try {
            const response = await fetch(
                'http://localhost:3000/api/user/signin',
                requestOptions
            )
            const userDataJson = await response.json()

            if (userDataJson.userId) {
                //const userDataJsonWitoutAdmin = JSON.parse(JSON.stringify(userDataJson))
                //delete userDataJsonWitoutAdmin.admin
                localStorage.setItem('user', JSON.stringify(userDataJson))
                const now = new Date().getTime()
                localStorage.setItem('setupTime', now)
                authenticateUser(JSON.stringify(userDataJson))
                navigate('/')
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

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }

        setValidated(true)
        if (form.checkValidity() === true) {
            event.preventDefault()
            event.stopPropagation()
            Login()
        }
    }

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    return (
        <Container fluid="md">
            {isCheckError ? (
                <Alert key="danger" variant="danger">
                    Veuillez verifier votre mail et mot de passe
                </Alert>
            ) : null}
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <div>
                    <Row className="justify-content-md-center">
                        <Col md="auto"><Title>Connexion à votre compte</Title></Col>
                    </Row>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustomEmail">
                                <Form.Label className="margin-top-30">Email:</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        aria-describedby="inputGroupPrepend"
                                        value={inputMailValue}
                                        onChange={handleInputMail}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Veuillez choisir un mail.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="validationCustom03">
                                <Form.Label className="margin-top-30">Mot de passe:</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={inputPasswordValue}
                                    onChange={handleInputPassword}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Veuillez choisir un mot de passe.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <Button type="submit">Se connecter</Button>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <Link to="/signup">Créer nouveau compte</Link>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )}
        </Container>
    )
}

export default Signin
