const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: "client_server",
    password: process.env.SQL_PASSWORD,
    connectionLimit: 10,
})

module.exports = pool;