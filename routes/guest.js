/** @format */
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middlewear/auth");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Bcrypt = require("bcryptjs");
const Admin = require("../model/gUser");

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));
/*
Name: Register Account
Desc: User registration form
Input: JSON with email, password, username, (key:value) pair
Output: JSON user created object or status 500 with error
*/
router.post("/register", async (req, res) => {
	const regUser = await Admin.findOne({ username: req.body.username, email: req.body.email });
	console.log(regUser);
	if (!regUser) {
		try {
			//await createUser(req.body);
			const newUser = await Admin.create({
				username: req.body.username,
				email: req.body.email,
				password: Bcrypt.hashSync(req.body.password, 10),
			});
			console.log(newUser);
			const result = await newUser.save();
			res.redirect("/login");
		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}
	} else {
		res.redirect("/register");
	}
});

//Login
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/account",
		failureRedirect: "/login?error=true",
	})
);

module.exports = router;
