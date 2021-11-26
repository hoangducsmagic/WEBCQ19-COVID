const express = require('express')
const path = require('path')
const demoRouter=require('./routes/demoRoutes')

// Start express app
const app = express();

// Set up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', demoRouter);

module.exports = app;