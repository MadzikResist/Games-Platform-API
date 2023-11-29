const PORT  = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const pool = require('./db')
const fetchGames = require('./getUpdateGames')

app.get('/games', async (req, res) => {
  const popularGamesQuery = await pool.query('SELECT id, name, publishers, header_image FROM games WHERE name IS NOT NULL LIMIT 100')
  res.json(popularGamesQuery.rows)
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
