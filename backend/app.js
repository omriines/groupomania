//Importation de variable d'environnement
require('dotenv').config();
//Import
const express = require('express');
//Analysez les corps de requête entrants dans un middleware
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/post');
//Permet de travailler avec des répertoires et des chemins de fichiers
const path = require('path');


//création application Express
const app = express();


//Résolution erreur CORS
app.use((req, res, next) => {
  //accéder à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Parser les corps des requête et forcer parse d'objets inclus dans d'autres objets
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Servir des fichiers statiques dans Express
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use() utilisé pour monter les fonctions middleware sur le chemin spécifié
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/post', likeRoutes);


module.exports = app;