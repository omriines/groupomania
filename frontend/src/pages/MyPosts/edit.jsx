import {useEffect, useState,useRef} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styled from "styled-components"
import {Loader} from "../../utils/style/Atoms"
import {MessageWarning} from "../../utils/style/Atoms"
import {LoaderWrapper} from "../../utils/style/Atoms"
import {useParams} from 'react-router-dom'
import {Alert} from "react-bootstrap";



const FormEdit = styled.form`
    padding: 32px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
`

function Edit() {

    const { idPost } = useParams()
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputMessageValue, setInputMessageValue] = useState('')
    const [inputImageValue, setInputImageValue] = useState('')
    const [selectedFile, setSelectedFile] = useState('');
    const [isMessage, setIsMessage] = useState('');


    function handleInputMessage(e) {
        setInputMessageValue(e.target.value)
    }
    function setInputImage(e){

    }
    function handleInputImage(e) {
        setSelectedFile(URL.createObjectURL(e.target.files[0]));
        setInputImageValue(e.target.files[0]);

    }
    useEffect(() => {

        async function fetchPosts() {
            setDataLoading(true)
            try {
                const userStorage = JSON.parse(localStorage.getItem("user"))
                const headers = new Headers(
                    {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + userStorage.token
                    }
                );
                const options = {
                    method: 'GET',
                    mode: 'cors',
                    headers
                };
                const response = await fetch(`http://localhost:3000/api/post/getPostById/`+idPost, options)
                const post = await response.json();
                setInputMessageValue(post.message);
                setInputImageValue(post.image);
                setSelectedFile(post.image);
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
            const userStorage = JSON.parse(localStorage.getItem("user"))
            const headers = new Headers(
                {
                    'Accept':  'application/json',
                    'Authorization': 'Bearer ' + userStorage.token
                }
            );

            const formData = new FormData();
            formData.append('post', JSON.stringify({
                "id":idPost,
                "message":inputMessageValue
            }));
            formData.append('image', inputImageValue);
            console.log(inputImageValue)
            const options = {
                method: 'PUT',
                mode: 'cors',
                headers,
                body: formData

            };

            const response = await fetch(`http://localhost:3000/api/post/update`, options)
            if (response.status === 200) {
                setIsMessage(true)
            }

        } catch (err) {
            console.log('===== error =====', err)
            setError(true)
        } finally {

        }
    }


    async function editPost() {
        updatePost();
    }

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    return (
        <div>
            {isMessage ? (
                <Alert key='success' variant='success'>
                    Votre poste a été modifiés avec succès!
                </Alert>
            ) : null}
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <FormEdit>
                    <Form.Group className="mb-3" controlId="formBasicMessage">
                        <Form.Label>Message :</Form.Label>
                        <Form.Control as="textarea" rows={3} value={inputMessageValue}
                                      onChange={handleInputMessage} />
                    </Form.Group>
                    <img src={selectedFile} alt="" width={50} height={50}/>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label></Form.Label>
                        { <Form.Control type="file"
                                        onChange={handleInputImage}/>
                        }
                    </Form.Group>

                    <Button variant="primary" onClick={() => editPost()}>
                        Modifier
                    </Button>
                </FormEdit>
            )}
        </div>
    )

}

export default Edit