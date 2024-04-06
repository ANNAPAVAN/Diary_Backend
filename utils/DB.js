const mysql = require("mysql");
const {config} = require("../config/index.js")

const db = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE
});

module.exports = {db}