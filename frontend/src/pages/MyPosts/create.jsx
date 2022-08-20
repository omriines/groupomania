import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { Loader } from '../../utils/style/Atoms'
import { MessageWarning } from '../../utils/style/Atoms'
import { LoaderWrapper } from '../../utils/style/Atoms'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link, useNavigate } from 'react-router-dom'

const Title = styled.h1`
  font-size: 2.5rem;
  margin-top: 30px;
`

function Create() {
  const navigate = useNavigate()
  const [isDataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(false)
  const [inputMessageValue, setInputMessageValue] = useState('')
  const [isMessage, setIsMessage] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [validated, setValidated] = useState(false)

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  function handleInputMessage(e) {
    setInputMessageValue(e.target.value)
  }

  async function createSubmit() {
    try {
      const userStorage = JSON.parse(localStorage.getItem('user'))
      const headers = new Headers({
        Accept: 'application/json',
        Authorization: 'Bearer ' + userStorage.token,
      })

      const formData = new FormData()
      const postData = JSON.stringify({
        message: inputMessageValue,
        UserId: userStorage.UserId,
      })
      formData.append('post', postData)
      formData.append('image', selectedFile)

      const options = {
        method: 'POST',
        mode: 'cors',
        headers,
        body: formData,
      }

      const response = await fetch(
        `http://localhost:3000/api/post/create`,
        options
      )
      if (response.status === 201) {
        navigate('/myposts/success')
      }
    } catch (err) {
      console.log('===== error =====', err)
      setError(true)
    } finally {
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
      createSubmit()
    }
  }

  if (error) {
    return <MessageWarning>Oups il y a eu un problème</MessageWarning>
  }

  return (
    <Container fluid="md">
      {isDataLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <div>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Title>Créer une poste</Title>
            </Col>
          </Row>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustomMessage">
                <Form.Label className="margin-top-30">Message :</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  placeholder="Message"
                  value={inputMessageValue}
                  onChange={handleInputMessage}
                />
                <Form.Control.Feedback type="invalid">
                  Veuillez choisir un message.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormFile">
                <Form.Label className="margin-top-30">
                  Télécharger une Image :
                </Form.Label>
                <Form.Control
                  required
                  type="file"
                  onChange={handleFileSelect}
                />
                <Form.Control.Feedback type="invalid">
                  Veuillez choisir une image.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="justify-content-md-center">
              <Col md="auto" className="buttonAccueil">
                <Link to={`/myposts`}>
                  <Button variant="secondary" size="lg">
                    Anunuler
                  </Button>
                </Link>
                <Button
                  className="margin-left-20"
                  type="submit"
                  variant="primary"
                  size="lg"
                >
                  Enregistrer
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </Container>
  )
}

export default Create
