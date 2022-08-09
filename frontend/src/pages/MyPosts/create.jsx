import {useState} from 'react'
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
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMessageValue, setInputMessageValue] = useState('')
    const [isMessage, setIsMessage] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0])
    }

    function handleInputMessage(e) {
        setInputMessageValue(e.target.value)
    }

    async function handleSubmit() {
        try {
            const userStorage = JSON.parse(localStorage.getItem("user"))
            const headers = new Headers(
                {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + userStorage.token
                }
            );

            const formData = new FormData();
            const postData = JSON.stringify({
                "message": inputMessageValue,
                "UserId": userStorage.UserId
            })
            formData.append("post", postData);
            formData.append("image", selectedFile);

            const options = {
                method: 'POST',
                mode: 'cors',
                headers,
                body: formData

            };

            const response = await fetch(`http://localhost:3000/api/post/create`, options)
            if (response.status === 201) {
                setIsMessage(true)
            }

        } catch (err) {
            console.log('===== error =====', err)
            setError(true)
        } finally {

        }
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
                                      onChange={handleInputMessage}/>
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Télécharger une Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileSelect}/>
                    </Form.Group>

                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Créer
                    </Button>
                </FormCreate>
            )}
        </div>
    )

}

export default Create