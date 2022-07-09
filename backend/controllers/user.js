//Import
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');

//Création d'un user
exports.signup = (req, res) => {

    const emailCryptoJs = encrypt(req.body.email);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: emailCryptoJs,
          name: req.body.name,
          password: hash,
          admin:req.body.admin
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message : error.message }));
      })
      .catch(error => res.status(500).json({ message : error.message }));
  };


//Login d'un user
exports.signin = (req, res) => {
   
    const emailCryptoJs = encrypt(req.body.email);
    User.findOne({ email: emailCryptoJs })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              email: decrypt(user.email),
              //Encoder un nouveau token
              token: jwt.sign(
                { userId: user._id },
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
exports.userProfil = (req, res) => {
    User.findOne({id: req.params.id})
        .then((user) => res.status(200).json(user))
    
        .catch((error) => res.status(500).json({ error }));
    
};

//modification d'un profil
exports.modifyUser = (req, res) => {

  User.findOne({id: req.params.id})
    .then((user) => {
        if(!User){
            res.status(404).json({ message : "Utilisateur introuvable !" });
        }
        else{
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const userId = decodedToken.userId;
            if(user.userId !== userId){
                res.status(403).json({ message : "Action non autorisée !" })
            }
            else {
                User.update(
                    {
                    name: req.body.username,
                    email: req.body.email,
                    password: req.body.description,
                    }
                )
                    .then(() => res.status(200).json({ message: "Compte mis à jour !" }))
                    .catch((error) => res.status(400).json({ error }));
                }   
                }
                })

             .catch((error) => res.status(500).json({ error }));
};


//Suppression d'un compte
exports.deleteUser = (req, res) => {
    User.findOne({id: req.params.id})
        .then((user) => {

            if(!User){
                res.status(404).json({ message : "Utilisateur introuvable !" });
            }
            else{
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                const userId = decodedToken.userId;
                if(!isAdmin(userId)){
                    res.status(403).json({ message : "Action non autorisée !" })
                }
                else {
         
            User.deleteOne({ id: req.params.id });
            res.status(200).json({ message: "Compte supprimé !" }); 

            }
        }
        })
    
        .catch((error) => res.status(500).json({ error }));
    };

