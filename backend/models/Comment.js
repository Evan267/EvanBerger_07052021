const { DataTypes } = require("sequelize");

module.exports  = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        text: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING(150)
        },
        upperCommentId: {
            type: DataTypes.INTEGER
        }
    });
    return Comment;
}