const { Sequelize } = require("../models");
const db = require("../models");
const Op = Sequelize.Op;
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;
const Like = db.likes;
const fs = require('fs');

const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');

exports.signUp  = (req, res, next) => {
    const userObject = JSON.parse(req.body.user);
    bcrypt.hash(userObject.password, 10)
        .then(hash => {
            let user = {};
            if (req.file === undefined){
                user = {
                    email: userObject.email,
                    password: hash,
                    firstname: userObject.firstname,
                    lastname: userObject.lastname,
                    birthdate: userObject.birthdate
            }} else  {
                user = {
                    email: userObject.email,
                    password: hash,
                    firstname: userObject.firstname,
                    lastname: userObject.lastname,
                    birthdate: userObject.birthdate,
                    image: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`,
                }
            }
            User.create(user)
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
};

exports.logIn = (req, res, next) => {
    User.findOne({where: {email: req.body.email}})
        .then(user => {
            if(!user){
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        token: jwt.sign(
                            { userId: user.id },
                            'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    return User.findOne({ where: { id: userId }, include: ["publications", "commentsUser"]})
        .then(user => {
            const filename = user.image.split('/images/users/')[1];
            fs.unlink(`images/users/${filename}`, () => {
                user.destroy()
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

exports.getUser = (req,res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    return User.findOne({attributes: ["id", "birthdate", "email", "firstname", "lastname", "image", "isAdmin"],where: { id: userId }})
        .then(user => res.status(200).json({user}))
        .catch(error => res.status(400).json({ error }));
}

exports.getOtherUser = (req,res, next) => {
    return User.findOne({attributes: ["id", "birthdate", "email", "firstname", "lastname", "image", "isAdmin"],where: { id: req.params.userId }})
        .then(user => res.status(200).json({user}))
        .catch(error => res.status(400).json({ error }));
}

exports.modifyUser = (req,res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Vh73yPzc92eZ79JKYpQ8YFgC7TV0DQtW5VoorINDld8HhEk7zEty2mqnEsi8NoY9O');
    const userId = decodedToken.userId;
    const userObject = JSON.parse(req.body.user);
    let user = {};
    if (userObject.user.password === undefined){
        if (req.file === undefined){
            user = {
                email: userObject.user.email,
                firstname: userObject.user.firstname,
                lastname: userObject.user.lastname,
                birthdate: userObject.user.birthdate
            };
            User.update(user, { where: { id: userId }})
                .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
                .catch (error => res.status(400).json({error}));
        } else  {
            user = {
                email: userObject.user.email,
                firstname: userObject.user.firstname,
                lastname: userObject.user.lastname,
                birthdate: userObject.user.birthdate,
                image: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`,
            }
            User.findOne({ where: { id: userId }})
                .then(userFind => {
                    const filename = userFind.image.split('/images/users/')[1];
                    fs.unlink(`images/users/${filename}`, () => {
                        User.update(user, { where: { id: userId }})
                        .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
                        .catch (error => res.status(400).json({error}));
                    })
                });
        }
    }else{
        bcrypt.hash(userObject.user.password, 10)
            .then(hash => {
                if (req.file === undefined){
                    user = {
                        email: userObject.user.email,
                        password: hash,
                        firstname: userObject.user.firstname,
                        lastname: userObject.user.lastname,
                        birthdate: userObject.user.birthdate
                    }
                    User.update(user, { where: { id: userId }})
                        .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
                        .catch (error => res.status(400).json({error}));
                } else  {
                    user = {
                        email: userObject.user.email,
                        password: hash,
                        firstname: userObject.user.firstname,
                        lastname: userObject.user.lastname,
                        birthdate: userObject.user.birthdate,
                        image: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`
                    }
                    User.findOne({ where: { id: userId }})
                        .then(userFind => {
                            const filename = userFind.image.split('/images/users/')[1];
                            fs.unlink(`images/users/${filename}`, () => {
                                User.update(user, { where: { id: userId }})
                                .then(() => res.status(201).json({ message: "La publication a été modifiée"}))
                                .catch (error => res.status(400).json({error}));
                            })
                        });
                }
            });
        }
}