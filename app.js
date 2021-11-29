const express = require('express')
const path = require('path')
const demoRouter = require('./routes/demoRoutes')
const { create } =require( 'express-handlebars');

// Start express app
const app = express();

// Set up view engine
const hbs = create({
    helpers: {
        // helper functions
    }
});
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', demoRouter);

module.exports = app;