
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/signup',multer, userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/getOne', auth,multer, userCtrl.userProfil);
router.put('/update',auth,multer, userCtrl.modifyUser);
router.delete('/delete', auth,multer, userCtrl.deleteUser);

module.exports = router;