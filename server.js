const PORT  = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const pool = require('./db')

//get all games
app.get('/games', async (req, res) => {
  try {
    // const games = await pool.query(`INSERT INTO games (id, name, description) VALUES ('1234', 'game', 'fdsfs')`)
    const games = await pool.query(`SELECT * FROM games`)
    res.json(games.rows)
  } catch (error) {
    console.error(error)
  }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
