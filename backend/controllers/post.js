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
  Post.findOne({
      attributes: [
        "id",
        "message",
        "image",
        "createdAt",
        "updatedAt",
        "UserId",
      ],
      where:{UserId: userId,
        id:req.params.id
      }
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
    // Post.findAll({
    //     attributes: [
    //       "id",
    //       "message",
    //       "image",
    //       "createdAt",
    //       "updatedAt",
    //       "userId",
    //     ],
    
    //     order: [["createdAt", "DESC"]],
    //     group:["id"],
    
    //     include: [
    //       {
    //         model : Like,
    //         attributes: [ [sequelize.fn('COUNT', sequelize.col('likes.id')), 'count']]
    //       },
    //       {
    //         model : User,
    //         attributes: [ "id"]
      
    //       },
    //       sequelize.literal(`(
    //         SELECT id AS LikeUser
    //         FROM Likes 
    //         WHERE
    //             Likes.userId = ${userId}
    //             AND
    //             Likes.postId = Posts.id
    //     )`),
    //     ],
    //   }
    //    )   
    //   //************* */
    
      
    //   //**************** */
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
          model: User,
          attributes: ["name", "id"],
        },
        {
                  model : Like,as :'likeCount',
                  attributes: [ [sequelize.fn('COUNT', sequelize.col('likes.id')), 'count']]
                },
        {
          model: Like,
          attributes: ["PostId", "UserId"],
          
          include: [
            {
              model: User,
              attributes: ["name"],
              where :{id:userId}
            },
          ],
        },
      
       
      ],
    })
   
      .then((Posts) => {res.status(201).json({Posts})
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({ message : error.message }); 
       
      })
     
    };
exports.update = (req, res, next) => {
  console.log("***********");
  console.log(req.body.post);
  const postObject=JSON.parse(req.body.post);
  const postImage=req.body.file;
  console.log(req.file.filename);
        console.log(postObject.id);
        Post.findOne({
          where: {
            id: postObject.id,
          },
        })
          .then(() => {
        //    console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`);
            Post.update(
              {
                
                image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
