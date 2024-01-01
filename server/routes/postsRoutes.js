const express = require("express");
const {
    getPosts,
    getPostsByUser,
    addPost,
    updatePost,
    deletePost
} = require("../db/posts")
const { deleteCommentsOfPost } = require("../db/comments")

const postsRoute = express.Router();

postsRoute.get("/", async (req, res) => {
    try {
        const posts = await getPosts();
        res.json(posts);
    } catch (err) {
        if (err.message === "No posts found") {
            res.status(404).json(err.message);
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

postsRoute.get("/:userId", async (req, res) => {
    try {
        const correntUser = req.params.userId;
        const posts = await getPostsByUser(correntUser)
        res.json(posts);
    } catch (err) {
        if (err.message === "please provide correct user id") {
            res.status(404).json(err.message);
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

postsRoute.post("/addPost/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const title = req.body.title;
        const postBody = req.body.postBody;
        const add = await addPost(userId, title, postBody);
        res.json(add);
    } catch (err) {
        if (err.message === "User not found. Please provide a valid userId.") {
            res.status(400).json(err.message);
        } else if (err.message === "add failed! check the details and try again") {
            res.status(400).json(err.message);
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

postsRoute.patch("/updatePost/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const postId = req.body.postId
        const newTitle = req.body.title
        const newBody = req.body.body
        const update = await updatePost(userId, postId, newTitle, newBody)
        res.json(update)
    } catch (err) {
        if (err.message === "post not found or unchanged") {
            res.status(404).json({ error: err.message })
        }
        else if (err.message === "You do not have permission to update this post") {
            res.status(400).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal server error" })
        }
    }
})

postsRoute.post("/deletePost/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.body.postId;
        const delPost = await deletePost(userId, postId)
        if (delPost) {
            const delComments = await deleteCommentsOfPost(postId)
            res.json({
                post: delPost,
                comment: delComments
            })
        } else {
            res.status(500).json({ error: "Failed to delete post" });
        }
    } catch (err) {
        if (err.message === "You do not have permission to delete this post") {
            res.status(403).json({ message: err.message });
        } else if (err.message === "post not found or not deleted") {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

module.exports = postsRoute;