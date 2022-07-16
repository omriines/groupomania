
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');


router.post("/signup", userCtrl.signup);
router.post("/signin", userCtrl.signin);
router.get('/getOne', auth, userCtrl.userProfil);
router.put('/update',auth, userCtrl.modifyUser);
router.delete('/delete', auth, userCtrl.deleteUser)

module.exports = router;