const express = require('express');
const path = require('path');
const demoRouter = require('./routes/demoRoutes');
const patientRouter = require('./routes/patientRoutes');
const productRouter = require('./routes/productRoutes');
const { create } = require('express-handlebars');

require('./models/db')
// Start express app
const app = express();

// Set up view engine
const hbs = create({
	helpers: {
		// helper functions
	},
	defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
	res.render('patients/patientsList');
});
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/patients', patientRouter);
app.use('/products', productRouter);
app.use('/', demoRouter);

module.exports = app;
