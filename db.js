const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: '5432',
  database: 'games_platform',
  server: 'localhost'

})

module.exports = pool
