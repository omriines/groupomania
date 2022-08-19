//Import
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const User = models.User;
const { encrypt, decrypt } = require('../utils/emailCrypto');

//Création d'un user
exports.signup = (req, res, next) => {

  console.log(req.body.password);
    const emailCryptoJs = encrypt(req.body.email);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
         User.create({
          email: emailCryptoJs,
          name: req.body.name,
          password: hash,
          admin:false
        },)
          .then((user) =>
          {
              res.status(201).json({
                  userId: user.id,
                  name: user.name,
                  admin:user.admin,
                  email: decrypt(user.email),
                  //Encoder un nouveau token
                  token :jwt.sign(
                      { userId: user.id, isAdmin: user.admin},
                      process.env.JWT_TOKEN_KEY,
                      { expiresIn: '24h' }
                  )

              });
          })
          .catch(error => {
            console.log(error);
            res.status(400).json({ message : error.message }); 
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message : error.message }); 
      });
  };



//Login d'un user
exports.signin = (req, res, next) => {
   
    const emailCryptoJs = encrypt(req.body.email);
    console.log(req.body.email+"ssssss");
    User.findOne({where:{ email: emailCryptoJs }})
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(400).json({ message: 'Mot de passe incorrect !' });
            }
            console.log("********************");
             console.log(req.body.email)
            res.status(200).json({
              userId: user.id,
              name: user.name,
              admin:user.admin,
              email: decrypt(user.email),
               //Encoder un nouveau token
               token :jwt.sign(
                { userId: user.id, isAdmin: user.admin},
                process.env.JWT_TOKEN_KEY,
                { expiresIn: '24h' }
              )
            
            });
          })
          .catch(error => res.status(500).json({ message : error.message }));
      })
      .catch(error => res.status(500).json({ message : error.message }));

}

//Profil d'un user
exports.userProfil = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
  console.log(userId);
    User.findOne({where:{id: userId}})
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
        
        res.status(200).json({
          userId: user.id,
          email: decrypt(user.email),
          image:user.image,
          
        
        });
      })
      .catch(error => res.status(500).json({ message : error.message }));

    
};

//modification d'un user
exports.modifyUser = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
  const userObject=JSON.parse(req.body.user);
    User.findOne({where:{id: userObject.id}})
    .then((user) => {
        if(!user){
            res.status(404).json({ message : "Utilisateur introuvable !" });
        }
        else{
          console.log("******: user trouvé");
          if(user.id=userId || isAdmin){
                console.log("******: "+userObject.id);
                console.log("+++++++: "+userObject.name);
                User.update({name: req.body.name, image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
                ,{
                  where: {
                    id: userObject.id
                  }
                })
                    .then(() => res.status(200).json({ message: "Compte mis à jour !" }))
                    .catch((error) => res.status(400).json({ error }));
                }   
            
            else {
              res.status(403).json({ message : "Action non autorisée !" })
                }
                
              }})
             .catch((error) => res.status(500).json({ error }));
};


//Suppression d'un user
exports.deleteUser = (req, res, next) => {
  console.log("+++++++++++"+req.body.id);
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
 
  User.findOne({where:{id: req.body.id}})
        .then((user) => {

            if(!user){
                res.status(404).json({ message : "Utilisateur introuvable !" });
            }
            else{
              console.log(user.id+"/"+userId+"/"+isAdmin);
              console.log(((user.id!=userId)));
              console.log((!isAdmin));
               if((user.id=userId) || (isAdmin)){
                User.destroy({where:{id: req.body.id }});
                res.status(200).json({ message: "Compte supprimé !" }); 
                   
                }
                else {
                  res.status(403).json({ message : "Action non autorisée !" })
             

            }
        }
        })
    
        .catch((error) => res.status(500).json({ message:error.message }));
    };

