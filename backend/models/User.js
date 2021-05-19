const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique:  true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATEONLY
        },
        image: {
            type: DataTypes.STRING(150),
            defaultValue: "http://localhost:3000/images/users/default.jpg"
        }
    });
    return User;
};