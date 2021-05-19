module.exports = (req, res, next) => {
    const userObject = JSON.parse(req.body.user);
    const regex = /(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const checkPassword = regex.test(userObject.password);
    if(checkPassword == true){
        console.log('réussi');
        next();
    }else{
        return res.status(403).json('Veuillez utiliser au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et au moins 6 caractères.')
    }
};