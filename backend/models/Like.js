module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define('like', {
        usersLiked: {
            type: DataTypes.SMALLINT.UNSIGNED,
            references: {
                model: User,
                key: 'id'
            }
        },
        usersDisliked: {
            type: DataTypes.SMALLINT.UNSIGNED,
            references: {
                model: User,
                key: 'id'
            }
        }
    });
    return Like;
}