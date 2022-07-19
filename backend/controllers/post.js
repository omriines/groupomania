//Import
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const Post = models.Post;
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