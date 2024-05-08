const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const insertData = (request, response) => {
  const { FoodCategory, FoodItem, per100grams, Cals_per100grams, KJ_per100grams } = request.body;
    pool.query(
      `INSERT INTO calories (food_categories, food_item, per100gram, cals_per100gram, kj_per100gram) VALUES ($1, $2, $3, $4, $5)`,
      [FoodCategory, FoodItem, per100grams, Cals_per100grams, KJ_per100grams],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Food added`);
      }
    );
};