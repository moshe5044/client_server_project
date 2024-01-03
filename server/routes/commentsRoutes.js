const express = require("express");
const {
    getComments,
    addComment,
    deleteComment
} = require("../db/comments");

const commentsRoute = express.Router();


module.exports = commentsRoute;