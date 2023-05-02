// Update with your config settings.
require("dotenv").config({ path: "../.envrc" });

// development
const {
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;
const dbConnection = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

// production
const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_PORT, DB_DATABASE } =
  process.env;
const prodDBConnection = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_DATABASE}`;

module.exports = {
  development: {
    client: "pg",
    connection: dbConnection,
  },

  production: {
    client: "pg",
    connection: {
      connectionString: prodDBConnection,
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
