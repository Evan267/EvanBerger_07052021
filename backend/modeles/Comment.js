const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class Publication extends Model {}

Publication.init({
    id: {
        type: DataTypes.INT.UNSIGNED,
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
    publicationId: {
        type: DataTypes.MEDIUMINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Publication,
            key: 'id'
        }
    },
    comment: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING(150)
    },
    upperCommentId: {
        type: DataTypes.INT.UNSIGNED
    }
}, {
        sequelize,
        modelName: 'Comment',
        updatedAt: false,
        createdAt: 'date'
});