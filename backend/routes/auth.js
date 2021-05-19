const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const logInLimiter = rateLimit({
    windowMs : 3 * 60 * 1000, 
    max : 3,
    message : "trop de tentative de connexion à la suite."
})

const checkPassword = require('../middleware/checkPassword');
const multer = require('../middleware/multer-config-user');

const authCtrl = require('../controllers/auth');

router.post('/signup', multer, checkPassword, authCtrl.signUp);
router.post('/login', logInLimiter, authCtrl.logIn);
router.get('/:id', authCtrl.getUser);
router.delete('/:id', authCtrl.deleteUser);

module.exports = router;