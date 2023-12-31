const express = require("express");
const login = require("../db/login");

const loginRoute = express.Router();

loginRoute.get("/", async (req, res) => {
    try {
        let userName = req.body.userName
        let password = req.body.password
        let user = await login(userName, password)
        console.log(user);
        res.json(user)
    } catch (err) {
        res.statusMessage = err
        res.status(500).send()
    }
})

module.exports = loginRoute