const { Sequelize } = require("../models");
const db = require("../models");
const Op = Sequelize.Op;
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;
const Like = db.likes;
const fs = require('fs');
const jwt =  require('jsonwebtoken');

exports.createPublication = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    const publicationObject = JSON.parse(req.body.text);
    let publication = {
        text: publicationObject,
        image: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`,
        userId: userId
    };
    Publication.create(publication)
        .then(() => res.status(201).json({ message: 'Nouvelle publication créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    return Comment.create({
        text: req.body.text,
        publicationId: req.params.publicationId,
        userId: userId
    })
        .then(() => res.status(201).json({ message: 'Nouveau commentaire créée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.likePublication = (req,res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    return Like.create({ publicationId: req.params.publicationId, usersLiked: userId })
        .then(() => res.status(201).json({message: 'Aime'}))
        .catch(error => res.status(400).json({error}));
};

exports.getOnePublication = (req, res, next) => {
    return Publication.findByPk(req.params.publicationId, {include: ["likes","user"]})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllPublications = (req,res,next) => {
    return Publication.findAll({include: ["comments", "likes", "user"]})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllPublicationsByUser = (req,res,next) => {
    return Publication.findAll({ where: { userId: req.params.userGet }, include: ["comments", "likes","user"]})
        .then(publication => res.status(200).json({publication}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllCommentsByPublication = (req, res, next) =>  {
    return Comment.findAll({ where: { publicationId: req.params.publicationId },include: ["userComment"]})
        .then(comments => res.status(200).json({comments}))
        .catch(error => res.status(400).json({error}));
};

exports.modifyPublication = (req, res, next) => {
    const publicationObject = JSON.parse(req.body.text);
    let publication = {};
    if(req.file === undefined){
        publication = {
            text: publicationObject
        }
        Publication.update(publication, { where: { id: req.params.publicationId }})
            .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
            .catch (error => res.status(400).json({error}))
    }else{
        publication = {
            text: publicationObject,
            image: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`
        }
        Publication.findOne({ where: { id: req.params.publicationId }})
            .then(publicationFind =>{
                const filename = publicationFind.image.split('/images/publications/')[1];
                fs.unlink(`images/publications/${filename}`, () => {
                    Publication.update(publication, { where: { id: req.params.publicationId }})
                        .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
                        .catch (error => res.status(400).json({error}))
                })
            })
    }
};

exports.deletePublication = (req, res, next) => {
    return Publication.findOne({ where: { id: req.params.publicationId }, include: ["comments", "likes"]})
        .then(publication => {
            const filename = publication.image.split('/images/publications/')[1];
            fs.unlink(`images/publications/${filename}`, () => {
                publication.destroy()
                    .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
        });
    })
        .catch(error => res.status(500).json({ error }));
};

exports.dislikePublication = (req,res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    return Like.destroy({ where: { publicationId: req.params.publicationId, usersLiked: userId }})
        .then(() => res.status(201).json({message: "N'aime plus"}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteComment = (req, res, next) => {
    Comment.destroy({ where: { id: req.params.commentId }})
        .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
        .catch(error => res.status(400).json({ error }));
}