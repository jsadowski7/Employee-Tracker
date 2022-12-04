// Import MySQL2
const mysql = require('mysql2');

// Import Inquirer
const inquirer = require('inquirer');

// Import console.table
const cTable = require('console.table');

// Create connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: ''
    },
    console.log(`Connected to the _____ database.`)
);