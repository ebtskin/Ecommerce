/** @format */

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const rUser = require("../model/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/gUser");

module.exports = function (passport) {
	passport.serializeUser((user, done) => {
		console.log("my user id is: ");
		console.log(user);
		return done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		console.log("my user id is 1111: ");
		console.log(id);
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use(
		"first",
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				console.log(
					"jaadfssafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
				);
				const newUser = {
					googleId: profile.id,
					displayName: profile.displayName,
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					image: profile.photos[0].value,
				};

				try {
					let user = await User.findOne({ googleId: profile.id });

					if (user) {
						done(null, user);
					} else {
						user = await User.create(newUser);
						return done(null, user);
					}
				} catch (err) {
					console.error(err);
				}
			}
		)
	);

	const authenticateUser = async (username, password, done) => {
		console.log(username);
		const user = await User.findOne({ username: username });
		console.log(user);
		if (user == null) {
			return done(null, false, { message: "No user with that email" });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Password incorrect" });
			}
		} catch (e) {
			return done(e);
		}
    }

	passport.use(
		new LocalStrategy({ usernameField: "username" }, authenticateUser)
	);
};
