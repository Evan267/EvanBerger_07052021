const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

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

const db = require('./models');
db.sequelize.sync({ force: true })
    .then(() => {
        console.log('Drop and re-sync db.');
    });

/*const userRoute = require('./routes/auth');
app.use('/api/auth', userRoute);

const publicationRoute = require('./routes/publications');
app.use('/api/publications', publicationRoute);*/



module.exports = app;