const express = require("express");
const { getTodos,
    getCompletedTodos,
    getUnCompletedTodos,
    addTodo,
    updateTitle,
    updateCompleted,
    deleteTodo
} = require("../db/todos")

const todosRoute = express.Router();

todosRoute.get("/:userId", async (req, res) => {
    try {
        const correntUser = req.params.userId;
        const todos = await getTodos(correntUser)
        res.json(todos);
    } catch (err) {
        res.statusMessage = err
        res.status(500).send()
    }
});

todosRoute.get("/completed/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const completedTodos = await getCompletedTodos(userId);
        res.json(completedTodos)
    } catch (err) {
        res.statusMessage = err
        res.status(500).send()
    }

});

todosRoute.get("/unCompleted/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const unCompletedTodos = await getUnCompletedTodos(userId);
        res.json(unCompletedTodos)
    } catch (err) {
        res.statusMessage = err
        res.status(500).send()
    }

});

todosRoute.post("/addTodo", async (req, res) => {
    try {
        const userId = req.body.userId;
        const title = req.body.title;
        const add = await addTodo(userId, title);
        res.json(add);
    } catch (err) {
        res.statusMessage = err
        res.status(500).send()
    }
});

todosRoute.patch("/updateTitle", async (req, res) => {
    try {
        const userId = req.body.userId
        const todoId = req.body.todoId
        const title = req.body.title
        const update = await updateTitle(userId, todoId, title)
        res.json(update)
    } catch (err) {
        if (err.message === "Todo not found or title unchanged") {
            res.status(404).json({ error: err.message })
        }
        else if (err.message === "You do not have permission to update this todo") {
            res.status(400).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal server error" })
        }
    }
});

todosRoute.patch("/updateCompleted/:todoId", async (req, res) => {
    try {
        const userId = req.body.userId
        const todoId = req.params.todoId;
        const update = await updateCompleted(userId, todoId);
        res.json(update);
    } catch (err) {
        if (err.message === "Todo not found or completed unchanged") {
            res.status(404).json(err.message);
        } else if (err.message === "You do not have permission to update this todo") {
            res.status(400).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
});

todosRoute.post("/deleteTodo/:todoId", async (req, res) => {
    try {
        const userId = req.body.userId;
        const todoId = req.params.todoId;
        const delTodo = await deleteTodo(userId, todoId);
        res.json(delTodo);
    } catch (err) {
        if (err.message === "You do not have permission to delete this todo") {
            res.status(403).json({ message: err.message });
        } else if (err.message === "Todo not found or not deleted") {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ error: "Internal server message" });
        }
    }
})

module.exports = todosRoute;