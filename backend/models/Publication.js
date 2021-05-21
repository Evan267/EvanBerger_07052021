const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define('publication', {        
        text: {
            type: DataTypes.TEXT,
        },
        image: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    });
    return Publication;
}