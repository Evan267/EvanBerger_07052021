const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const publicationCtrl = require('../controllers/publications');

router.post('/:userId', auth, publicationCtrl.createPublication);
router.post('/:userId/:publicationId/comments', auth, publicationCtrl.createComment);
router.post('/:userId/:publicationId/likes', auth, publicationCtrl.likePublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/:userId', auth, publicationCtrl.getAllPublicationsByUser);
router.get('/:id/comments', auth, publicationCtrl.getAllCommentsByPublication);
router.put('/:id', auth, publicationCtrl.modifyPublication);
router.put('/:id/comments/:commentId', auth, publicationCtrl.modifyComment);
router.delete('/:id', auth, publicationCtrl.deletePublication);
router.delete('/:id/comments', auth, publicationCtrl.deleteComment);


module.exports = router;