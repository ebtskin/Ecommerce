/** @format */
const { ensureAuth, ensureGuest } = require("../middlewear/auth");
const express = require("express");
const bodyParser = require("body-parser");
const ProductModel = require("../model/products");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//Main page
//GET

router.get("/", ensureGuest, (req, res) => {
	res.render("loginView", { layout: "login" });
});

router.get("/login", ensureGuest, (req, res) => {
	res.render("userLogin", { layout: "userLogin" });
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.get("/account", ensureAuth, async (req, res, done) => {

	const apple = { name: '1',
big: '2', gig: '3'};

	try {
		let products = await ProductModel.find({});
		if (req.user) {
			res.render("dashboard", {
				layout: "userDashboard",
				name: req.user.firstName,
				product: products,
			});
		} else {
			console.log("error reading req.user");
		}
	} catch (e) {
		console.errors(e);
	}
});

module.exports = router;
