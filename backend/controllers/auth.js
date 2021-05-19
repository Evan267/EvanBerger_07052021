const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');

exports.signUp  = (req, res, next) => {
    console.log(JSON.parse(req.body.user));
    console.log(req.file);
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
                    imageUrl: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`,
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
                        userId: user.id,
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
    return User.find({ where: { id: req.params.id }})
        .then(user => {
            const filename = user.image.split('/images/users/')[1];
            fs.unlink(`images/users/${filename}`, () => {
                User.destroy({ where: { id: req.params.id }})
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

exports.getUser = (req,res, next) => {
    return User.findOne({ where: { id: req.params.id }})
        .then(user => res.status(200).json({user}))
        .catch(error => res.status(400).json({ error }));
}