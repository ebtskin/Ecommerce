/** @format */

const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

dotenv.config({ path: "./config/config.env" });

connectDB();

//passport google user
require("./config/passport")(passport);

//passport regular user
require("./config/localPassport")(passport);

const app = express();

if (process.env.NODE_ENV == "development") {
	app.use(morgan("dev"));
}

app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
//Express Sessions
app.use(
	session({
		secret: "Asian Sauces",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

//Google Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Static files
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/guest", require("./routes/guest"));

const PORT = process.env.PORT || 9000;

app.listen(
	PORT,
	console.log(
		`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
	)
);
