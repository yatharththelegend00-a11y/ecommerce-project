// server/seed.js
require('dotenv').config();
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  await db.execute({
    sql: "INSERT INTO products (name, price, description, image_url, category, stock) VALUES (?, ?, ?, ?, ?, ?)",
    args: ["Wireless Headphones", 2999, "Noise cancelling headphones", "https://via.placeholder.com/300", "Electronics", 10]
  });
  console.log("Dummy product added!");
}

seed();