// Update with your config settings.
require("dotenv").config({ path: "../.env" });

const {
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;
const dbConnection = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
console.log(process.env.DATABASE_URL);

module.exports = {
  development: {
    client: "pg",
    connection: dbConnection,
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
