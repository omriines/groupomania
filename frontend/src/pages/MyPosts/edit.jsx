import {useEffect, useState, useRef} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import {Loader} from '../../utils/style/Atoms'
import {MessageWarning} from '../../utils/style/Atoms'
import {LoaderWrapper} from '../../utils/style/Atoms'
import {Link, useParams} from 'react-router-dom'
import {Alert} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const FormEdit = styled.form`
  padding: 32px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
`

const Title = styled.h1`
  font-size:2.5rem;
  margin-top:30px
`

function Edit() {
    const {idPost} = useParams()
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMessageValue, setInputMessageValue] = useState('')
    const [inputImageValue, setInputImageValue] = useState('')
    const [selectedFile, setSelectedFile] = useState('')
    const [isMessage, setIsMessage] = useState('')
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false)

    function handleInputMessage(e) {
        setInputMessageValue(e.target.value)
    }

    function handleInputImage(e) {
        setSelectedFile(URL.createObjectURL(e.target.files[0]))
        setInputImageValue(e.target.files[0])
    }

    useEffect(() => {
        async function fetchPosts() {
            setDataLoading(true)
            try {
                const userStorage = JSON.parse(localStorage.getItem('user'))
                const headers = new Headers({
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + userStorage.token,
                })
                const options = {
                    method: 'GET',
                    mode: 'cors',
                    headers,
                }
                const response = await fetch(
                    `http://localhost:3000/api/post/getPostById/` + idPost,
                    options
                )
                const post = await response.json()
                setInputMessageValue(post.message)
                setInputImageValue(post.image)
                setSelectedFile(post.image)
                console.log(post.image)
            } catch (err) {
                console.log('===== error =====', err)
                setError(true)
            } finally {
                setDataLoading(false)
            }
        }

        fetchPosts()
    }, [])

    async function updatePost() {
        try {
            const userStorage = JSON.parse(localStorage.getItem('user'))
            const headers = new Headers({
                Accept: 'application/json',
                Authorization: 'Bearer ' + userStorage.token,
            })

            const formData = new FormData()
            formData.append(
                'post',
                JSON.stringify({
                    id: idPost,
                    message: inputMessageValue,
                })
            )
            formData.append('image', inputImageValue)
            console.log(inputImageValue)
            const options = {
                method: 'PUT',
                mode: 'cors',
                headers,
                body: formData,
            }

            const response = await fetch(
                `http://localhost:3000/api/post/update`,
                options
            )
            if (response.status === 200) {
                setIsMessage(true)
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
            updatePost()
        }
    }

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    return (
        <Container fluid="md">
            {isMessage
                ? (
                    <Alert key="success" variant="success">
                        Votre poste a été modifiés avec succès!
                    </Alert>
                )
                : null}

            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <div>
                    <Row className="justify-content-md-center">
                        <Col md="auto"><Title>Modifier une poste</Title></Col>
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
                                <Form.Label className="margin-top-30">Télécharger une Image :</Form.Label>
                                <img src={selectedFile} alt="" width={50} height={50}/>
                                <Form.Control
                                    type="file"
                                    onChange={handleInputImage}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Veuillez choisir une image.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <Link to={`/myposts`}>
                                    <Button variant="secondary" size="lg">
                                        Voir mes postes
                                    </Button>
                                </Link>
                                <Button className="margin-left-20" type="submit" variant="primary" size="lg">
                                    Mettre à jour
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )}
        </Container>
    )
}

export default Edit
