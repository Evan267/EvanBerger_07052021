const { DataTypes } = require("sequelize");

module.exports  = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        text: {
            type: DataTypes.TEXT
        },
        upperCommentId: {
            type: DataTypes.INTEGER
        }
    });
    return Comment;
}