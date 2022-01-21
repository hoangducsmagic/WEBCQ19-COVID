const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

require("./models/db");

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
