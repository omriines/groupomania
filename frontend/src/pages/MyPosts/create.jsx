import {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from "styled-components"
import {Loader} from "../../utils/style/Atoms"
import {MessageWarning} from "../../utils/style/Atoms"
import {LoaderWrapper} from "../../utils/style/Atoms"
import {useParams} from 'react-router-dom'
import {Alert} from "react-bootstrap";

const FormCreate = styled.form`
    padding: 32px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
`

function Create() {
    const { idPost } = useParams()
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMessageValue, setInputMessageValue] = useState('')
    const [isMessage, setIsMessage] = useState(false)

    function handleInputMessage(e) {
        setInputMessageValue(e.target.value)
    }

    async function createPost() {
        setIsMessage(true)
    }

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    return (
        <div>
            {isMessage ? (
                <Alert key='success' variant='success'>
                    Votre poste a été crée avec succès!
                </Alert>
            ) : null}
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <FormCreate>
                    <Form.Group className="mb-3" controlId="formBasicMessage">
                        <Form.Label>Message :</Form.Label>
                        <Form.Control as="textarea" rows={3} value={inputMessageValue}
                                      onChange={handleInputMessage} />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Télécharger une Image</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>

                    <Button variant="primary" onClick={() => createPost()}>
                        Créer
                    </Button>
                </FormCreate>
            )}
        </div>
    )

}

export default Create