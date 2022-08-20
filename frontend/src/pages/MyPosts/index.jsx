import { useEffect, useState, useContext } from 'react'
import { MessageWarning } from '../../utils/style/Atoms'
import { LoaderWrapper } from '../../utils/style/Atoms'
import { Loader } from '../../utils/style/Atoms'
import styled from 'styled-components'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'
import { Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const CardsContainer = styled.div`
  margin-top: 0px;
`
const PostsContainer = styled.div`
  margin: 0px 20px !important;
`

const ButtonCreate = styled.div`
  float: right;
  padding: 30px;
`

const PageTitle = styled.h1`
  font-size: 30px;
  color: black;
  text-align: center;
  margin-top: 20px;
`

function Posts() {
  const [isDataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(false)
  const [postsList, setPostsList] = useState([])
  const [show, setShow] = useState(false)
  const [idPostDelete, setIdPostDelete] = useState()
  const [isLoad, setIsLoad] = useState(0)
  const { message } = useParams()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
          `http://localhost:3000/api/post/getPostByIdUser/` +
            userStorage.userId,
          options
        )
        const data = await response.json()
        setPostsList(data.Posts)
        setIsLoad(1)
      } catch (err) {
        console.log('===== error =====', err)
        setError(true)
      } finally {
        setDataLoading(false)
        setIsLoad(0)
      }
    }
    fetchPosts()
  }, [isLoad])

  function deletePost(postId) {
    setIdPostDelete(postId)
    handleShow()
  }

  async function confirmDelete() {
    const userStorage = JSON.parse(localStorage.getItem('user'))
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userStorage.token,
    })

    const options = {
      method: 'DELETE',
      mode: 'cors',
      headers,
      body: JSON.stringify({ id: idPostDelete }),
    }

    setDataLoading(true)
    try {
      const response = await fetch(
        'http://localhost:3000/api/post/delete',
        options
      )
      const responseData = await response.json()
      if (response.status === 200) {
        handleClose()
        //setIsLoad(1)
        window.location.reload()
      }
    } catch (err) {
      console.log('===== error =====', err)
      setError(true)
    } finally {
      setDataLoading(false)
      setIsLoad(0)
    }

    handleClose()
  }

  if (error) {
    return <MessageWarning>Oups il y a eu un problème</MessageWarning>
  }

  return (
    <PostsContainer>
      {message === 'success' ? (
        <Alert key="success" variant="success">
          Votre poste a été crée avec succès!
        </Alert>
      ) : null}
      <PageTitle>Mes postes :</PageTitle>
      {isDataLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <CardsContainer>
          <ButtonCreate>
            <Link to={`/myposts/create`}>
              <Button variant="primary">Créer une poste</Button>
            </Link>
          </ButtonCreate>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Message</th>
                <th>Date de publication</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {postsList.map((post) => (
                <tr key={`${post.id}`}>
                  <td>
                    <img src={post.image} width={30} height={30} />
                  </td>
                  <td>{post.message}</td>
                  <td>{moment(post.createdAt).format('DD/MM/YYYY')}</td>
                  <td className="button">
                    <Link to={`/myposts/edit/${post.id}`}>
                      <Button variant="secondary">Modification</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => deletePost(post.id)}
                    >
                      Suppression
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardsContainer>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Voulez‑vous vraiment supprimer cette poste?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
    </PostsContainer>
  )
}

export default Posts
