const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const publicationCtrl = require('../controllers/publications');

router.post('/', auth, multer, publicationCtrl.createPublication);
router.post('/:id/comments', auth, multer, publicationCtrl.createComment);
router.post('/:id/likes', auth, publicationCtrl.likePublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/:userId', auth, publicationCtrl.getAllPublicationsByUser);
router.get('/:id/comments', auth, publicationCtrl.getAllCommentsByPublication);
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);
router.put('/:id/comments/:id', auth, multer, publicationCtrl.modifyComment);
router.delete('/:id', auth, multer, publicationCtrl.deletePublication);
router.delete('/:id/comments/:id', auth, multer, publicationCtrl.deletePublication);


module.exports = router;