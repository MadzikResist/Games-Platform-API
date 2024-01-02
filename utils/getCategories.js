const pool = require("../db");


const getCategories = async () => {
  const cat = await pool.query(
    `SELECT genres FROM games WHERE genres IS NOT NULL`,
  );
  const categoriesData = cat?.rows || [];

  const uniqueCategoriesSet = new Set(
    categoriesData.flatMap((data) =>
      data?.genres.map((sec) => sec?.description),
    ),
  );
  const uniqueCategoriesArray = Array.from(uniqueCategoriesSet);

  console.log("Unique Categories", uniqueCategoriesArray);
};

module.exports = getCategories;
