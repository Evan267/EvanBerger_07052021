const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.SMALLINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
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
        type: DataTypes.DATE
    },
    image: {
        type: DataTypes.STRING(150),
        defaultValue: "https://localhost:3000/images/default.jpg"
    }
}, {
        sequelize,
        modelName: 'User',
        updatedAt: false,
});