import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useState } from 'react'
import { Loader, LoaderWrapper } from '../../utils/style/Atoms'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { MessageWarning } from '../../utils/style/Atoms'

export const CardPost = styled.div`
  margin-top: 50px !important;
`
export const ButtonLike = styled.button`
  background-color: #0d6efd;
  border: solid 1px #0d6efd;
  border-radius: 0.375rem;
  padding: 6px 10px 6px 10px;
  color: #ffffff;
`
export const CountLike = styled.span`
  padding-right: 8px;
  color: #0d6efd;
`

export const ButtonDisLike = styled.button`
  background-color: #ffffff;
  border: solid 1px #0d6efd;
  border-radius: 0.375rem;
  padding: 6px 10px 6px 10px;
  color: #0d6efd;
`

const CardWrapper = styled.div`
  margin-top: 30px;
`
const CrudAdmin = styled.span`
  float: right;
`

function Cards({ post }) {
  // const [checked, setChecked] = useState(post.Likes.length === 0 ? false : true);
  const userStorage = JSON.parse(localStorage.getItem('user'))
  let result = false
  const [countLikes, setCountLikes] = useState(post.Likes.length)
  const [isDataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const [idPostDelete, setIdPostDelete] = useState()
  const [isLoad, setIsLoad] = useState(0)
  const [isAdmin, setIsAdmin] = useState(userStorage.admin)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  if (post.Likes.length !== 0) {
    for (let i = 0; i < post.Likes.length; i++) {
      if (post.Likes[i].UserId === userStorage.userId) {
        result = true
      }
    }
  }
  const [checked, setChecked] = useState(result)
  // post.Likes?.forEach(element => {
  //     if (element.UserId === userStorage.userId)
  //         {
  //             result= true
  //         }
  // })
  async function likeAction(postId) {
    setError(false)
    //   const userStorage = JSON.parse(localStorage.getItem("user"))

    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userStorage.token,
    })

    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ postId: postId }),
      headers,
    }
    setDataLoading(true)
    try {
      const response = await fetch(
        'http://localhost:3000/api/post/like',
        requestOptions
      )
      if (response.status === 200) {
        if (checked === false) {
          setChecked(true)
          setCountLikes(countLikes + 1)
        } else {
          setChecked(false)
          setCountLikes(countLikes - 1)
        }
      } else {
        setError(true)
      }
    } catch (err) {
      console.log('===== error =====', err)
      setError(true)
    } finally {
      setDataLoading(false)
    }
  }
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
    console.log(idPostDelete)
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
        console.log('ines true')
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
    <div>
      {isDataLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <CardWrapper>
          <Card>
            <Card.Header as="h5">{post.User.name}</Card.Header>
            <Card.Body>
              <Card.Img variant="top" src={post.image} />
              <Card.Text>{post.message}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <CountLike>{countLikes}</CountLike>

              {checked ? (
                <ButtonLike onClick={() => likeAction(post.id)}>
                  J'aime(s)
                </ButtonLike>
              ) : (
                <ButtonDisLike onClick={() => likeAction(post.id)}>
                  J'aime(s)
                </ButtonDisLike>
              )}
              {error ? (
                <Alert key="danger" variant="danger">
                  Oups il y a eu un problème
                </Alert>
              ) : null}
              {isAdmin ? (
                <CrudAdmin>
                  <Link to={`/myposts/edit/${post.id}`}>Modification</Link>
                  <Button variant="danger" onClick={() => deletePost(post.id)}>
                    Suppression
                  </Button>
                </CrudAdmin>
              ) : null}
            </Card.Footer>
          </Card>
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
        </CardWrapper>
      )}
    </div>
  )
}

Cards.propTypes = {
  post: PropTypes.object.isRequired,
}

export default Cards
