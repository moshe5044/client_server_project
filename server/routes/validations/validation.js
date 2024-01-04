const express = require("express");
const joi = require("joi");

function handleWrongId(req, res, next) {                      //getTodos, getCompletedTodos, getUnCompletedTodos, getPosts, getPostByUser, getComments
    const idSchema = joi.number().min(1).max(10).positive().integer().required();
    const { error } = idSchema.validate(req.params.userId);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function addTodoValidation(req, res, next) {                 //addTodo
    const userSchema = joi.object({
        title: joi.string().min(1).required()
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
} 

function updateCompletedAndDeleteVal(req, res, next) {          //updateCompleted, delete in todos posts and comments
    const itemSchema = joi.object({
        itemId: joi.number().min(1).positive().required()
    });
    const { error } = itemSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function updateTitleVal(req, res, next) {
    const bodySchema = joi.object({
        todoId: joi.number().min(1).positive().required(),
        title: joi.string().min(1).required()
    });
    const { error } = bodySchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function addPostVal(req, res, next) {
    const addPostSchema = joi.object({
        title: joi.string.min(1).require(),
        postBody: joi.string().min(1).required()
    });
    const { error } = addPostSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function updatePostVal(req, res, next) {
    const updatePostSchema = joi.object({
        postId: joi.number().min(1).positive().required(),
        title: joi.string.min(1).require(),
        postBody: joi.string().min(1).required()
    });
    const { error } = updatePostSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function handleWrongPostId(req, res, next) {
    const postIdSchema = joi.number().min(1).required();
    const { error } = postIdSchema.validate(req.params.userId);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function addCommentVal(req, res, next) {
    const addCommentSchema = joi.object({
        postId: joi.number().min(1).positive().required(),
        name: joi.string.min(1).require(),
        email: joi.string().email().required(),
        commentBody: joi.string().min(1).required()
    });
    const { error } = addCommentSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

module.exports = { handleWrongId, 
    addTodoValidation, 
    updateCompletedAndDeleteVal, 
    updateTitleVal, 
    addPostVal, 
    updatePostVal, 
    handleWrongPostId, 
    addCommentVal 
}