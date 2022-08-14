Projet 7 : Groupomania
*Scénario*
Je suis développeuse web chez CONNECT-E, ma mission consiste à construire un réseau social interne pour les employés de Groupomania (développer les parties frontend et backend).

*Dossier Central*
Créez un dossier nommé GROUPOMANIA. A l'intérieur de ce dossier créez un dossier nommé Backend

*Dossier Backend*

-Installation:
Accédez sur https://nodejs.org/en/ pour télécharger puis installer Node.js sur votre machine
Dans le terminal du dossier backend :cd Backend:
Chargez le package nodemon : npm install -g nodemon
Pour installer Express.js, exécutez la commande : npm install --save express
pour le téléchargement de fichiers, installez le package Multer : npm install --save multer
Lancez les commandes: npm i fs, npm install body-parser

-Configuration de la base de données :

Toujours dans le terminal du dossier backend
Installez mysql2: npm install mysql2

Pour installer Sequelize et Sequelize CLI, exécutez les commandes: npm install sequelize, npm install --save sequelize-cli puis npx sequelize init. Cela créera les dossiers config, models et migrations. Le dossier config contient le fichier de configuration, qui indique à sequelize comment se connecter à la base de données. Vous devez remplir ce fichier comme suit:

"username": "Nom de L'utilisateur de la base de données MySQL",

"password": "mot de passe de l'utilisateur de la base de données MySQL",

"database": "nom de la base de données MySQL",

"host": "lien de la base de données MySQL",

"dialect": "mysql"

-Une fois que vous avez correctement configuré le fichier de configuration, créez les modèles User, Post et Like comme suit :

npx sequelize model:generate --name User --attributes "name:string,email:string,password:string,image:string,admin:boolean" ,

npx sequelize model:generate --name Post --attributes "userId:integer,image:string,message:string",

npx sequelize model:generate --name Like --attributes "userId:integer,postId:integer"

Jusqu'à cette étape, nous n'avons rien inséré dans la base de données. Maintenant, pour créer réellement une base de données et ses tables, vous devez :
Exécutez la commande : npx sequelize-cli db:migrate
Indication:

Avant d'accéder à l'application, vous devrez installer dotenv: npm install dotenv et créer un fichier d'environnement nommé .env dans le répertoire racine du dossier backend. Dans le fichier .env, ajoutez vos variables d'environnement comme ci-dessous :

DB_USERNAME='Nom de L'utilisateur de la base de données MySQL'

DB_PASSWORD='mot de passe de l'utilisateur de la base de données MySQL'

DB_HOST='lien de la base de données MySQL'

DB_Name='nom de la base de données MySQL'

SECRET_KEY='clé secrète du token qui doit être difficile à pirater'

Pour la sécurité de l'application, installez:

npm install --save bcrypt,

npm install --save jsonwebtoken,

lancez le serveur: nodemon server
Exécution de l’api sur http://localhost:3000

*Frontend*
Framework React.js 

Installation
Ouvrez un terminal dans le dossier central GROUPOMANIA:
Tapez la commande npx create-react-app frontend
Puis cd frontend :
Exécuter la commande npm install pour installer tous les modules nécessaires au fonctionnement de l'application.
Installez Bootstrap : npm install bootstrap 
Lancez la commande npm start
Le serveur est accessible en local via le port 3001: http://localhost:3001/