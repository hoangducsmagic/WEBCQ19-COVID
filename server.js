const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT || 3000;

// set up PostgreSQL database
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
    .then(() => {
        console.log("✅ Successfully connect to PostgreSQL");
    })
    .catch((err) => {console.log("Connect to PostgreSQL failed: ",err)});

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
