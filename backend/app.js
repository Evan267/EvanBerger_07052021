const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

const bcrypt = require('bcrypt');
const db = require('./models');
const User = db.users;
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Drop and re-sync db.');
    })
    .then(() => {
        bcrypt.hash('GroupoAdmin!63', 10)
        .then(hash => {
            let admin = {
            email: "groupomania@admin.com",
            password: hash,
            firstname: "Administrateur",
            lastname: "Groupomania",
            birthdate: new Date(1970, 1, 1),
            isAdmin: "true"
            };
            User.create(admin)
            .then(() => console.log("admin créé"))
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    })

const userRoute = require('./routes/auth');
app.use('/api/auth', userRoute);

const publicationRoute = require('./routes/publications');
app.use('/api/publications', publicationRoute);



module.exports = app;