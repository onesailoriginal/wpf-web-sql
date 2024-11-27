const {Sequelize, DataTypes } = require('sequelize')
const databaseHandler = new Sequelize("ucp", "root", "", {
    dialect: 'mysql',
    host: 'localhost'
})


exports.table = databaseHandler.define('users', {
    'id':{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    'name':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'number':{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})