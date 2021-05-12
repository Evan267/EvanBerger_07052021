const db = require("../models");
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;
const Like = db.likes;

exports.createPublication = (req, res, next) => {
    return Publication.create({
        description: req.body.description,
        image: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`,
        userId: req.body.userId
    })
        .then(() => res.status(201).json({ message: 'Nouvelle publication créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.createComment = (req, res, next) => {
    return Comment.create({
        text: req.body.text,
        image: `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}`,
        upperCommentId: req.body.upperCommentId,
        publicationId: req.body.publicationId,
        userId: req.body.userId
    })
        .then(() => res.status(201).json({ message: 'Nouveau commentaire créée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.likePublication = (req,res, next) => {
    if(req.body.like == 1){
        return Like.create({ publicationId: req.body.publicationId, usersLiked: req.body.userId })
            .then(() => res.status(201).json({message: 'Aime'}))
            .catch(error => res.status(400).json({error}));
    } else if(req.body.like == 0){
        return Like.destroy({ where: { publicationId: req.body.publicationId, [Op.or]: [{usersLiked: req.body.userId}, {usersDisliked: req.body.userId}]}})
            .then(() => res.status(201).json({message: "Plus d'avis"}))
            .catch(error => res.status(400).json({error}));
    } else if(req.body.like == -1){
        return Like.create({ usersDisliked: req.body.userId })
            .then(() => res.status(201).json({message: "N'aime pas"}))
            .catch(error => res.status(400).json({error}));
    }
};

exports.getOnePublication = (req, res, next) => {
    return Publication.findByPk(req.body.publicationId, { include: ["likes"] })
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllPublications = (req,res,next) => {
    return Publication.find({include: ["comments", "likes"]})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllPublicationsByUser = (req,res,next) => {
    return Publication.findAll({ where: { userId: req.body.userId }}, {include: ["comments", "likes"]})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllCommentsByPublication = (req, res, next) =>  {
    return Comment.findAll({ where: { publicationId: req.body.publicationId }})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
}

exports.modifyPublication = (req, res, next) => {
    return Publication.update({
        description: req.body.description,
        image: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`
    }, { where: { id: req.body.id }})
        .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
        .catch (error => res.status(400).json({error}))
}

exports.modifyComment = (req, res, next) => {
    return Comment.update({
        text: req.body.text,
        image: `${req.protocol}://${req.get('host')}/images/comment/${req.file.filename}`,
    }, { where: { id: req.body.id }})
        .then(() => res.status(201).json({ message: "Le commentaire a été modifié"}))
        .catch (error => res.status(400).json({error}))
}

exports.deletePublication = (req, res, next) => {
    return Publication.find({ where: { id: req.params.id }})
        .then(publication => {
            const filename = publication.image.split('/images/publications/')[1];
            fs.unlink(`images/publications/${filename}`, () => {
                Publication.destroy({ where: { id: req.params.id }})
                    .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
        });
    })
        .catch(error => res.status(500).json({ error }));
}

exports.deleteComment = (req, res, next) => {
    return Comment.find({ where: { id: req.params.id }})
        .then(comment => {
            const filename = comment.image.split('/images/comments/')[1];
            fs.unlink(`images/comments/${filename}`, () => {
                Comment.destroy({ where: { id: req.params.id }})
                    .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
        });
    })
        .catch(error => res.status(500).json({ error }));
}