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
            type: DataTypes.DATE
        },
        image: {
            type: DataTypes.STRING(150),
            defaultValue: "https://localhost:3000/images/default.jpg"
        }
    });
    return User;
};