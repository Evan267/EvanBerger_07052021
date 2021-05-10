module.exports  = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        text: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING(150)
        },
        upperCommentId: {
            type: DataTypes.INT.UNSIGNED
        }
    });
    return Comment;
}