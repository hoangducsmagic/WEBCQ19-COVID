const { Pool } = require("pg");
const pgp = require('pg-promise')({capSQL: true});

// set up PostgreSQL database
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    
});

const db= pgp({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
    .then(() => {
        console.log("✅ Successfully connect to PostgreSQL");
    })
    .catch((err) => {
        console.log("Connect to PostgreSQL failed: ", err);
    });

exports.getQuery = function (sqlQuery) {
    return new Promise((resolve, reject) => {
        pool.query(sqlQuery, (err, res) => {
            if (!err) resolve(res.rows);
            else {
                console.log(err);
            }
            // else reject(err);
        });
    });
};


module.exports.db = db;
module.exports.pgp = pgp;

exports.executeQuery = function (sqlQuery) {
    return new Promise((resolve) => {
        pool.query(sqlQuery, (err, res) => {
            if (!err) {
                console.log("Query successfully executed");
                resolve();
            } else {
                console.log(err);
            }
            // else reject(err);
        });
    });
};

