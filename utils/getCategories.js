const pool = require("../db");
// const getCategories = async () => {
//   const cat = await pool.query(`SELECT categories FROM games LIMIT 2`);
//   const categoriesData = cat.rows || [];
//   // const descriptions = categoriesData.map((category) => category.description);
//   const data = categoriesData.map((data, index) => {
//     console.log(data.categories);
//     const secData = data.categories;
//     return secData.map((sec, index) => {
//       return (arrCat = sec.description);
//     });
//   });
//   console.log("data", data);
// };

const getCategories = async () => {
  const cat = await pool.query(
    `SELECT categories FROM games WHERE categories IS NOT NULL`,
  );
  const categoriesData = cat?.rows || [];

  const uniqueCategoriesSet = new Set(
    categoriesData.flatMap((data) =>
      data?.categories.map((sec) => sec?.description),
    ),
  );
  const uniqueCategoriesArray = Array.from(uniqueCategoriesSet);

  console.log("Unique Categories", uniqueCategoriesArray);
};

module.exports = getCategories;
