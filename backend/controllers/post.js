//Import
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const Post = models.Post;
const User = models.User;
const { encrypt, decrypt } = require('../utils/emailCrypto');

exports.create = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    console.log("userid:"+userId);
  //  console.log(JSON.parse(req.body.message));
  const postObject=JSON.parse(req.body.post);
console.log("message:"+postObject.message);
       Post.create({
       message: postObject.message,
       image : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       UserId:userId,
     }) 
     .then(() => res.status(201).json({ message: 'Post créé !' }))
     .catch(error => {
       console.log(error);
       res.status(400).json({ message : error.message }); 
      
     })

    };

exports.getAll = (req, res, next) => {
    console.log("entré dans API");
    Post.findAll({
        attributes: [
          "id",
          "message",
          "image",
          "createdAt",
          "updatedAt",
          "UserId",
        ],
    
        order: [["createdAt", "DESC"]],
    
        include: [
          {
            model: User,
            attributes: ["name", "id"],
          },
        ],
      })
      .then((Posts) => res.status(201).json({Posts}))
      .catch(error => {
        console.log(error);
        res.status(400).json({ message : error.message }); 
       
      })
     
    };
exports.update = async (req, res, next) => {
        console.log(req.body.id);
        Post.findOne({
          where: {
            id: req.body.id,
          },
        })
          .then(() => {
            Post.update(
              {
                message: req.body.message,
              },
              {
                where: { id: req.body.id },
              }
            )
              .then(() => res.status(200).json({ message: "Post mis à jour !" }))
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
};