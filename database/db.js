import { config } from 'dotenv';
import pkg from 'pg';

config();

const { Pool } = pkg;

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

database.on("connect", () => {
  console.log("DB Connected");
});

database.on("error", (err) => {
  console.error("Unexpected DB error", err);
});

export default database;
