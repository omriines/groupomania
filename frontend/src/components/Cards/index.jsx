import Card from "react-bootstrap/Card";
import PropTypes from 'prop-types'

function Cards({post}) {

    return(
        <Card>
            <Card.Header as="h5">{post.name}</Card.Header>
            <Card.Body>
                <Card.Img variant="top" src="{post.image}" />
                <Card.Text>
                    {post.message}
                </Card.Text>
            </Card.Body>
        </Card>
    )

}

Cards.propTypes = {
    post: PropTypes.object.isRequired,
}

/*Cards.defaultProps = {
    image: '',
    message: '',
    name: '',
}*/

export default Cards