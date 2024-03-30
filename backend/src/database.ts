import pg from "pg";

if (process.env.DB_HOST === undefined || process.env.DB_DATABASE === undefined || process.env.DB_USER === undefined || process.env.DB_PASSWORD === undefined || process.env.DB_CONNECTION_LIMIT === undefined || isNaN(Number(process.env.DB_CONNECTION_LIMIT))) {
  console.error("Please set the environment variables for the database connection");
  process.exit(1);
}

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  max: Number(process.env.DB_CONNECTION_LIMIT),
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
