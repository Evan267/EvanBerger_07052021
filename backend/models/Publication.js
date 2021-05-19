const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define('publication', {        
        description: {
            type: DataTypes.TEXT,
        },
        url: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    });
    return Publication;
}