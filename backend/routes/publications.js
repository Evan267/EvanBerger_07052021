const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config-publication');

const publicationCtrl = require('../controllers/publications');

router.post('/', auth, multer, publicationCtrl.createPublication);
router.post('/:publicationId/comments', auth, publicationCtrl.createComment);
router.post('/:publicationId/likes', auth, publicationCtrl.likePublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.get('/:publicationId', auth, publicationCtrl.getOnePublication);
router.get('/user/:userGet', auth, publicationCtrl.getAllPublicationsByUser);
router.get('/:publicationId/comments', auth, publicationCtrl.getAllCommentsByPublication);
router.put('/:publicationId', auth, multer, publicationCtrl.modifyPublication);
router.delete('/:publicationId/likes', auth, publicationCtrl.dislikePublication);
router.delete('/:publicationId', auth, multer, publicationCtrl.deletePublication);
router.delete('/:commentId/comments', auth, publicationCtrl.deleteComment);


module.exports = router;