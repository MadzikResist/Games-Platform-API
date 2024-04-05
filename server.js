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
const cronFunctions = require("./utils/crons");
app.use(cors());
// const {Sequelize} = require("sequelize")
//
// const sequelize = new Sequelize(process.env.DATABASE_URL,{
//   dialect: "sqlite",
//   storage: "./database.sqlite",
//   logging: false
// })



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
    option = "",
    filter = "",
    sortBy = "Recommendations",
  } = req.body || {};
  let queryFilter;
  console.log(option, "option");
  console.log("sortBy", sortBy);
  console.log("filter", filter);
  if (filter === "genres" && option !== "Any" && sortBy === "Recommendations") {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(genres) AS genre WHERE genre ->> 'description' ILIKE $1 AND genres IS NOT NULL
    ORDER BY recommendations DESC LIMIT 11 OFFSET $2`;
  } else if (
    filter === "genres" &&
    option !== "Any" &&
    sortBy === "Title A-Z"
  ) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(genres) AS genre WHERE genre ->> 'description' ILIKE $1 AND genres IS NOT NULL
    ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name LIMIT 11 OFFSET $2`;
  } else if (
    filter === "genres" &&
    option !== "Any" &&
    sortBy === "Title Z-A"
  ) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(genres) AS genre WHERE genre ->> 'description' ILIKE $1 AND genres IS NOT NULL
    ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name DESC LIMIT 11 OFFSET $2`;
  } else if (
    filter === "categories" &&
    option !== "Any" &&
    sortBy === "Recommendations"
  ) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(categories) AS category WHERE category ->> 'description' ILIKE  $1 AND categories IS NOT NULL
    ORDER BY recommendations DESC LIMIT 11 OFFSET $2`;
  } else if (
    filter === "categories" &&
    option !== "Any" &&
    sortBy === "Title A-Z"
  ) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(categories) AS category WHERE category ->> 'description' ILIKE $1 AND categories IS NOT NULL
    ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name LIMIT 11 OFFSET $2`;
  } else if (
    filter === "categories" &&
    option !== "Any" &&
    sortBy === "Title Z-A"
  ) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games, LATERAL unnest(categories) AS category WHERE category ->> 'description' ILIKE $1 AND categories IS NOT NULL
    ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name DESC LIMIT 11 OFFSET $2`;
  } else if (filter === "" && option === "" && sortBy === "Title A-Z"){
    queryFilter = `SELECT id, name, publishers, header_image FROM games ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name LIMIT 11 OFFSET $1`;
  } else if (filter === "" && option === "" && sortBy === "Title Z-A"){
    queryFilter = `SELECT id, name, publishers, header_image FROM games ORDER BY
    CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
    END,
    name DESC LIMIT 11 OFFSET $1`;
  }

  else {
    queryFilter = `SELECT id, name, publishers, header_image FROM games ORDER BY recommendations DESC LIMIT 11 OFFSET $1`;
  }

  if (text) {
    queryFilter = `SELECT id, name, publishers, header_image FROM games WHERE name ILIKE $1 ORDER BY CASE
    WHEN name ~ '^[a-zA-Z]' THEN 1
    ELSE 2
  END,
  name ASC LIMIT 11 OFFSET $2`;
  }
  const storeGamesQuery = await pool.query(queryFilter, text ? [`%${text}%`,offset] : option ? [option, offset] : [offset]);
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

cronFunctions()
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
