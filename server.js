const PORT  = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const pool = require('./db')
const fetchGames = require('./getUpdateGames')
const addGamesToDB = require('./addGamesToDB');

app.get('/games', async (req, res) => {
  const popularGamesQuery = await pool.query(`SELECT id, name, publishers, header_image, recommendations ->> 'total' AS  total_recommendations FROM gamesNew WHERE name IS NOT NULL ORDER BY CAST(recommendations ->> 'total' AS INTEGER) DESC LIMIT 100`)
  res.json(popularGamesQuery.rows)
})
// addGamesToDB()

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
