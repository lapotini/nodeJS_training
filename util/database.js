const mysql = require('mysql2');
const Sequelize = require('sequelize');


const sequelize = new Sequelize('node-complete', 'user', 'password', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;
