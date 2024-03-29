const express = require('express');
//Transmettre les demandes prises en charge aux fonctions de contrôleur appropriées
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const likesCtrl = require("../controllers/like");


router.post('/create',auth,multer, postCtrl.create);
router.get('/getAll',auth, multer,postCtrl.getAll);
router.get('/getPostByIdUser/:id',auth, multer,postCtrl.getPostByIdUser);
router.get('/getPostById/:id',auth, multer,postCtrl.getPostById);
router.put('/update',auth,multer, postCtrl.update);
router.delete('/delete',auth,multer ,postCtrl.delete);
// Likes ---------------------------------------
router.post('/like', auth, likesCtrl.addLike);
module.exports = router;