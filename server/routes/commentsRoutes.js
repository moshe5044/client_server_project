const express = require("express");
const authenticate = require("../routes/validations/authentication")
const {
    getComments,
    addComment,
    deleteComment,
} = require("../db/comments");
const { handleWrongId, 
    updateCompletedAndDeleteVal, 
    handleWrongPostId, 
    addCommentVal 
} = require("./validations/validation")

const commentsRoute = express.Router();


commentsRoute.get("/:postId", handleWrongPostId, async (req, res) => {
    try {
        const postId = req.params.postId
        const comments = await getComments(postId);
        res.json(comments);
    } catch (err) {
        if (err.message === "No comments found") {
            res.status(404).send(err.message);
        } else {
            res.status(500).send({ error: "Internal server message" });
        }
    }
})

commentsRoute.post("/addComment/:postId", handleWrongPostId, addCommentVal, async (req, res) => {
    try {
        const postId = req.params.postId;
        const name = req.body.name;
        const email = req.body.email;
        const commentBody = req.body.commentBody;
        const add = await addComment(postId, name, email, commentBody);
        res.json(add)
    } catch (err) {
        if (err.message === "add failed! check the details and try again") {
            res.status(400).json(err.message);
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

commentsRoute.delete("/delete/:userId", handleWrongId, updateCompletedAndDeleteVal, async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.body.itemId;
        const delComment = await deleteComment(userId, itemId);
        res.json(delComment);
    } catch (err) {
        if (err.message === "You do not have permission to delete this comment") {
            res.status(403).json({ message: err.message });
        } else if (err.message === "comment not found or not deleted") {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

module.exports = commentsRoute;