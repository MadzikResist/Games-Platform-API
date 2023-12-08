const PORT = process.env.PORT ?? 8000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jsonParser = bodyParser.json();
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const pool = require("./db");
const fetchGames = require("./getUpdateGames");
const addGamesToDB = require("./addGamesToDB");
const cors = require("cors");
app.use(cors());
app.get("/games", async (req, res) => {
  const popularGamesQuery = await pool.query(
    `SELECT id, name, publishers, header_image, recommendations ->> 'total' AS  total_recommendations FROM games WHERE name IS NOT NULL ORDER BY CAST(recommendations ->> 'total' AS INTEGER) DESC LIMIT 100`,
  );
  res.json(popularGamesQuery.rows);
});
// addGamesToDB()
app.post("/game", jsonParser, async (req, res) => {
  console.log("req", req.body.id);
  const gameOneQuery = `SELECT * FROM games WHERE id = ($1)`;
  const result = await pool.query(gameOneQuery, [req.body.id]);

  if (result.rows.length > 0) {
    console.log("result", result.rows[0]);
    return res.json(result.rows[0]);
  } else {
    throw new Error("Game not found");
  }
});

app.get("/store", async (req, res) => {});
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
