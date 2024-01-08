const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: "json_server",
    password: process.env.SQL_PASSWORD || '0528616622',
})

module.exports = pool;