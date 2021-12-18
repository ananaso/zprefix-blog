// Update with your config settings.
require("dotenv").config({ path: "../.env" });

const {
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;
const { USERNAME, PASSWORD, HOSTNAME, PORT, DATABASE } = process.env.db;
const dbConnection = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
const prodDBConnection = `postgres://${USERNAME}:${PASSWORD}@${HOSTNAME}:${PORT}/${DATABASE}`;
console.log(prodDBConnection, process.env);

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
