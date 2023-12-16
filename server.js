const PORT = process.env.PORT ?? 8000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jsonParser = bodyParser.json();
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const pool = require("./db");
const fetchGames = require("./getUpdateGames");
const addGamesToDB = require("./addGamesToDB");
const getCategories = require("./utils/getCategories");
const cors = require("cors");
app.use(cors());
app.get("/games", async (req, res) => {
  const popularGamesQuery = await pool.query(
    `SELECT id, name, publishers, header_image, recommendations ->> 'total' AS  total_recommendations FROM games WHERE name IS NOT NULL ORDER BY CAST(recommendations ->> 'total' AS INTEGER) DESC LIMIT 10`,
  );
  res.json(popularGamesQuery.rows);
});
// addGamesToDB()
// getCategories();

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

app.post("/store", jsonParser, async (req, res) => {
  const {
    offset = 0,
    text = "",
    option = "Recommendations",
    filter = "",
  } = req.body || {};
  let queryFilter;
  console.log(option, "option");

  if (filter === "genres" && option !== "Any") {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(genres) AS genre WHERE genre ->> 'description' ILIKE '%${option}%' AND genres IS NOT NULL`;
  } else if (filter === "categories" && option !== "Any") {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(categories) AS category WHERE category ->> 'description' ILIKE '%${option}%' AND categories IS NOT NULL`;
  } else {
    queryFilter = `SELECT id, name, publishers, header_image FROM games`;
  }
  let query = `${queryFilter} ORDER BY
  CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
  END,
  name ASC LIMIT 11 OFFSET $1`;
  if (text) {
    query = `SELECT id, name, publishers, header_image FROM games WHERE name ILIKE $1  ORDER BY CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
  END,
  name ASC LIMIT 11 OFFSET $2`;
  } else if (option === "Recommendations") {
    query = `SELECT id, name, publishers, header_image FROM games ORDER BY recommendations DESC LIMIT 11 OFFSET $1`;
  } else if (option === "Title A-Z") {
    query = `SELECT id, name, publishers, header_image FROM games ORDER BY CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
  END,
  name ASC LIMIT 11 OFFSET $1`;
  } else if (option === "Title Z-A") {
    query = `SELECT id, name, publishers, header_image FROM games ORDER BY CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
  END,name DESC LIMIT 11 OFFSET $1`;
  }
  const storeGamesQuery = await pool.query(
    query,
    text ? [`%${text}%`, offset] : [offset],
  );
  let hasNextPage = false;
  if (storeGamesQuery.rows.length > 10) {
    hasNextPage = true;
    storeGamesQuery.rows.pop();
  }
  res.json({
    hasNextPage,
    offset: offset + storeGamesQuery.rows.length,
    games: storeGamesQuery.rows,
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
