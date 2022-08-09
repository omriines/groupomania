import { useState, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { Loader } from '../../utils/style/Atoms'
import { MessageWarning } from '../../utils/style/Atoms'
import { LoaderWrapper } from '../../utils/style/Atoms'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { UserContext } from '../../utils/context/user'

const FormSignin = styled.form`
  padding: 32px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
`

function Signin() {
  const [isDataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(false)
  const [inputMailValue, setInputMailValue] = useState('')
  const [inputPasswordValue, setInputPasswordValue] = useState('')
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const navigate = useNavigate()
  const [isCheckError, setIsCheckError] = useState(false)
  const { setUser, user } = useContext(UserContext)

  function handleInputMail(e) {
    setInputMailValue(e.target.value)
  }

  function handleInputPassword(e) {
    setInputPasswordValue(e.target.value)
  }

  async function Login() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        localStorage.setItem('user', JSON.stringify(userDataJson))
        const now = new Date().getTime()
        localStorage.setItem('setupTime', now)
        setUser(JSON.stringify(userDataJson))
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
    navigate('/')
  }

  return (
    <div>
      {isCheckError ? (
        <Alert key="danger" variant="danger">
          Veuillez verifier votre mail et mot de passe
        </Alert>
      ) : null}
      {isDataLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <FormSignin>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Adresse E-mail:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Adresse E-mail"
              value={inputMailValue}
              onChange={handleInputMail}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mot de passe:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              value={inputPasswordValue}
              onChange={handleInputPassword}
            />
          </Form.Group>
          <Button variant="primary" onClick={() => Login()}>
            Se connecter
          </Button>
          <Link to="/signup">Créer nouveau compte</Link>
        </FormSignin>
      )}
    </div>
  )
}

export default Signin
