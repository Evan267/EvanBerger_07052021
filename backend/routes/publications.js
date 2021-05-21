const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config-publication');

const publicationCtrl = require('../controllers/publications');

router.post('/:userId', multer, publicationCtrl.createPublication);
router.post('/:userId/:publicationId/comments', auth, publicationCtrl.createComment);
router.post('/:userId/:publicationId/likes', auth, publicationCtrl.likePublication);
router.get('/:userId', auth, publicationCtrl.getAllPublications);
router.get('/:userId/:publicationId', auth, publicationCtrl.getOnePublication);
router.get('/:userId', auth, publicationCtrl.getAllPublicationsByUser);
router.get('/:userId/:publicationId/comments', auth, publicationCtrl.getAllCommentsByPublication);
router.put('/:userId/:publicationId', auth, publicationCtrl.modifyPublication);
router.put('/:userId/comments/:commentId', auth, publicationCtrl.modifyComment);
router.delete('/:userId/:publicationId', auth, publicationCtrl.deletePublication);
router.delete('/:userId/:commentId/comments', auth, publicationCtrl.deleteComment);


module.exports = router;