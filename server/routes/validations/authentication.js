const express = require("express")
const login = require("../../db/login");

async function authenticate(req, res, next) {
    const auth = req.headers.auth;
    const [providedUserName, providedPassword] = auth.split(":");
    try {
        const user = await login(providedUserName, providedPassword)
        req.user = user; 
        next();
    } catch (err) { 
        res.status(401).send()   
    }
} 

module.exports = authenticate 