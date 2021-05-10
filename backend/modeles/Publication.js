const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Publication extends Model {}

Publication.init({
    id: {
        type: DataTypes.MEDIUMINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
}, {
        sequelize,
        modelName: 'Publication',
        updatedAt: false,
        createdAt: 'date'
});