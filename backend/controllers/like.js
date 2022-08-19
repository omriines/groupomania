const models = require('../models');
const Like = models.Like;
const jwt = require('jsonwebtoken');


exports.addLike =  (req, res, next) => {
 console.log("ines");

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    Like.findOne({
      where: {
        UserId: userId,
        PostId: req.body.postId,
      }
    })
    .then(like => {
        if (like) {
            like.destroy(
                {
                  where: {
                    UserId: userId,
                    PostId: req.body.postId,
                  },
                },
              );
              res.status(404).json({ message: "Post disliké !" });
            }
              else {
                Like.create({
                    UserId: userId,
                    PostId: req.body.postId,
                  });
              return res.status(200).json({ message: 'Post liké !' });
              } 
    })  .catch(error => res.status(500).json({ message : error.message }));
}