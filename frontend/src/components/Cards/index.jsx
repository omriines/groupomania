import Card from "react-bootstrap/Card";
import PropTypes from 'prop-types'
import styled from "styled-components";
import {Link} from "react-router-dom";
import colors from "../../utils/style/colors";

const FormSignin = styled.form`
    padding: 32px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
`
export const CardPost = styled.div`
      margin-top:50px !important;
`

function Cards({post}) {

    return(
        <CardPost>
            <Card>
                <Card.Header as="h5">{post.User.name}</Card.Header>
                <Card.Body>
                    <Card.Img variant="top" src={post.image} />
                    <Card.Text>
                        {post.message}
                    </Card.Text>
                </Card.Body>
            </Card>
        </CardPost>
    )

}

Cards.propTypes = {
    post: PropTypes.object.isRequired,
}

export default Cards