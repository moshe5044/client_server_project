const express = require("express");
const login = require("../db/login");

const loginRoute = express.Router();


loginRoute.post("/", async (req, res) => {
    try {
        let userName = req.body.userName
        let password = req.body.password
        let user = await login(userName, password)
        res.json(user)
    } catch (err) {
        if (err.message === "User not found") {
            res.status(404).json({ message: err.message });
        } else if (err.message === "Password does not match") {
            res.status(404).json({ message: err.message })
        } else {
            res.status(500).json({ error: "Internal server message" });
        } 
    }
})

module.exports = loginRoute