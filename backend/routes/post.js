const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/create',auth,multer, postCtrl.create);
router.get('/getAll',auth, multer,postCtrl.getAll);
router.put('/update',auth,multer, postCtrl.update);
/*router.get('/delete',auth, postCtrl.delete);
*/
module.exports = router;