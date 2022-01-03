const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const passport = require('./middleware/passport');

const patientRouter = require("./routes/patientRoutes");
const productRouter = require("./routes/productRoutes");
const statisticRouter = require("./routes/statisticRoutes");
const productPackageRouter = require("./routes/productPackageRoutes");
const facilityRouter = require("./routes/facilityRoutes");
const managerRouter = require("./routes/managerRoutes");
const accountRouter = require("./routes/accountRoutes");
const adminRouter = require("./routes/adminRoutes");

require('./models/db')
// Start express app
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(methodOverride('_method'));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(session({secret:  process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine
const hbs = create({
    helpers: {
        ifEqual(a, b, option) { if (a == b) return option.fn(this) },
        ifNotEqual(a, b, option) { if (a != b) return option.fn(this) },
        ifLessThan(a,b,option) { if (a<b) return option.fn(this) },
        ifLessThanOrEqual(a,b,option) { if (a<=b) return option.fn(this) },
    },
    defaultLayout: "main",
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/patients", patientRouter);
app.use("/products", productRouter);
app.use("/statistic", statisticRouter);
app.use("/productPackages", productPackageRouter);
app.use("/facilities",facilityRouter);
app.use("/managers",managerRouter);
app.use('/account', accountRouter);
app.use('/admin', adminRouter);

app.get("/", (req, res) => {
    res.redirect("/patients");
});

app.get('/check', (req, res) => {
    res.render('admin/accountHistory');
})

module.exports = app;
