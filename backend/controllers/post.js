//Import
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const sequelize= require('sequelize');
const Post = models.Post;
const User = models.User;
const Like = models.Like;
const { encrypt, decrypt } = require('../utils/emailCrypto');
const fs = require("fs");

exports.create = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    console.log("userid:"+userId);
    const postObject=JSON.parse(req.body.post);
    let postImage=""
    if (req.body.image == null){
      postImage=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      console.log(req.file.filename)
    }else  
    if(postImage.includes("http://localhost:3000/images/")){
      postImage=req.body.image
    };
    // else{
    //   postImage=`${req.protocol}://${req.get('host')}/images/${'post.jpg'}`
    // };

       console.log("message:"+postObject.message);
       
       Post.create({
       message: postObject.message,
       image : postImage,
       UserId:userId,
     }) 
     .then(() => res.status(201).json({ message: 'Post créé !' }))
     .catch(error => {
       console.log(error);
       res.status(400).json({ message : error.message }); 
      
     })

    };

exports.getPostByIdUser = (req, res, next) => {
  console.log("entré dans API:"+req.params.id);
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
      group:["id"],
  
      include: [
        {
          model : Like,
          attributes: [ [sequelize.fn('COUNT', sequelize.col('likes.id')), 'count'],
      ]
        },
        {
          model: User,
          attributes: ["name", "id"],
          
        }
       
      ],
      where:{userId: req.params.id}
    
    })
    .then((Posts) => res.status(201).json({Posts}))
    .catch(error => {
      console.log(error);
      res.status(400).json({ message : error.message }); 
     
    })
   
  };
//------------------------
exports.getPostById = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
  console.log("id:"+req.params.id);
  Post.findOne({
      attributes: [
        "id",
        "message",
        "image",
        "createdAt",
        "updatedAt",
        "UserId",
      ],
      where:{
        id:req.params.id
      },
    })
    .then((post) => res.status(201).json({
      id:post.id,
      UserId: post.UserId,
      message: post.message,
      image:post.image,
    }))
    .catch(error => {
      console.log(error);
      res.status(400).json({ message : error.message }); 
     
    })
   
  };
//-----------------

exports.getAll = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
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
          attributes: ["id","name"],
        },
        // {
        //           model : Like,
        //           attributes: [ [sequelize.fn('COUNT', sequelize.col('postId')), 'count']]
        //         },
        {
          model: Like,
          attributes: ["PostId", "UserId"],

          include: [
            {
              model: User,
              attributes: ["id","name"],
          
            },
          ],
        },

      ],
    })
   
      .then((Posts) => {

          res.status(201).json({Posts})
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({ message : error.message }); 
       
      })
     
    };
exports.update = (req, res, next) => {
  const postObject=JSON.parse(req.body.post);
  let postImage="";
        Post.findOne({
          where: {
            id: postObject.id,
          },
        })
          .then(() => {
           if (req.body.image == null){
              postImage=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }else  
            if(postImage.includes("http://localhost:3000/images/")){
              postImage=req.body.image
            };
            Post.update(
              {   
                image: postImage,
                message: postObject.message,
              },
              {
                where: { id: postObject.id },
              }
            )
              .then(() => res.status(200).json({ message: "Post mis à jour !" }))
              .catch((error) => res.status(400).json({ message:error.message }));
          })
          .catch((error) => res.status(500).json({ message:error.message }));
};
// Suppression d'un post -------------------------------------------------------------------
exports.delete = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
  console.log(req.body.id);
  Post.findOne({
    attributes: [
      "id",
      "UserId",
      "image",
    ],
    where: {
      id: req.body.id,
    },
  })
    .then((post) => {
      console.log(isAdmin);
      console.log("post.userId:"+post.UserId)
      console.log("userID:"+userId)
       if ((isAdmin) ||( post.UserId==userId)){
          if (post.image !== null) {
            // Si image présente on la supprime du répertoire, puis on supprime le post de la BDD
            const filename = post.image.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              Like.destroy(
                {where:{PostId: post.id}},
                
              );
              Post.destroy(
                {where:{id: post.id}},
                
              );
              res.status(200).json({ message: "Post supprimé !" });
            });
          } else { // Sinon on supprime uniquement le post
            Post.destroy(
              { where: { id: post.id }},
            );
            res.status(200).json({ message: "Post supprimé !" });
          }
      }
      else {
        res.status(403).json({ message : "Action non autorisée !" })
          }
    })

    .catch((error) => res.status(500).json({ message:error.message }));
};
