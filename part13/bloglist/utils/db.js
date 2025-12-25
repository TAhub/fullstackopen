const { Sequelize } = require('sequelize')
const config = require('../utils/config')
module.exports = new Sequelize(config.POSTGRES_URL)
