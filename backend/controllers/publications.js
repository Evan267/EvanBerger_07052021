const db = require("../models");
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;
const Like = db.likes;

exports.createPublication = (userId, publication) => {
    return Publication.create({
        description: publication.description,
        image: `${publication.protocol}://${publication.get('host')}/images/publications/${publication.file.filename}`,
        userId: userId
    })
        .then((publication) => {
            console.log(">> Created publication: " + JSON.stringify(publication, null, 4));
            return publication;
        })
        .catch((err) => {
            console.log(">> Error while creating tutorial: ", err);
        });
};

exports.createComment = (userId, publicationId, comment) => {
    return Comment.create({
        text: comment.text,
        image: `${comment.protocol}://${comment.get('host')}/images/comments/${comment.file.filename}
        upperCommentId:
    })
}