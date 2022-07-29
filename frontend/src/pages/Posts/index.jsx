import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react'
import {MessageWarning} from "../../utils/style/Atoms"
import {LoaderWrapper} from "../../utils/style/Atoms"
import {Loader} from "../../utils/style/Atoms"
import Cards from "../../components/Cards";

function Posts() {
  

    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)
    const [postsList, setPostsList] = useState([]);
/*
    const fetchPosts = async () => {
       
        const {data} = await fetch(`http://localhost:3000/api/post/getAll`)
        const postsList = data;
        setPostsList(postsList);
        console.log(postsList);
      };
    
      useEffect(() => {
        fetchPosts();
      }, []);*/
    

    useEffect(() => {
        async function fetchPosts() {
            setDataLoading(true)
            try {

                const headers = new Headers();
                headers.append('Authorization', "Bearer "+localStorage.getItem("token"));
                const options = {
                method: 'GET',
                mode: 'cors',
                headers
                };

 
                const response = await fetch('http://localhost:3000/api/post/getAll', options)
                const {data} =  await response.json();
                console.log(data);
                const products = data;
                setPostsList(products);
                console.log("postliste:::"+postsList);
             
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
        
        <div>
            
                {postsList.map((post) => (
                    <Cards
                        key={`${post.id}`}
                        message={post.message}
                        image={post.image}
                        name ={post.User.name}
                    />
                ))}
        </div>
    )
}

export default Posts