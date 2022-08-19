import { useEffect, useState } from 'react'
import {MessageWarning} from "../../utils/style/Atoms"
import {LoaderWrapper} from "../../utils/style/Atoms"
import {Loader} from "../../utils/style/Atoms"
import Cards from "../../components/Cards";
import styled from "styled-components";

const CardsContainer = styled.div`
  margin-top: 20px
`
const PostsContainer = styled.div`
    margin:0px 20px !important;
`

const PageTitle = styled.h1`
  font-size: 30px;
  color: black;
  text-align: center;
  margin-top:20px;
`

function Posts() {

    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [postsList, setPostsList] = useState([]);


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

                const response = await fetch(`http://localhost:3000/api/post/getAll`, options)
                const data = await response.json();
                setPostsList(data.Posts);
            } catch (err) {
                console.log('===== error =====', err)
                setError(true)
            } finally {
                setDataLoading(false)
            }
        }
        fetchPosts()
    }, [])

    if (error) {
        return <MessageWarning>Oups il y a eu un problème</MessageWarning>
    }

    return (
        <PostsContainer>
            <PageTitle>Liste des postes :</PageTitle>
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            ) : (
                <CardsContainer>
                    {postsList.map((post) => (
                        <Cards
                            key={`${post.id}`}
                            post={post}
                        />
                    ))}
                </CardsContainer>
            )}
        </PostsContainer>
    )
}

export default Posts