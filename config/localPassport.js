/** @format */

const LocalStrategy = require("passport-local").Strategy;
const Users = require("../model/User");
const bcrypt = require("bcrypt");
const { findOne } = require("../model/User");

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		console.log(email);
		const user = await Users.findOne({ email: email });
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
	};

	passport.use(
		"first",
		new LocalStrategy({ usernameField: "email" }, authenticateUser)
	);

	passport.serializeUser((user, done) => {
		console.log("my user id is: ");
		console.log(user.id);
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}

module.exports = initialize;

/* module.exports = function (passport) {
	passport.use(new localStrategy(function (email, password, done) {
            console.log("userewksdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
			User.findOne({ email: email }, function (err, user) {
				if (err) return done(err);
				if (!user)
					return done(null, false, {
						message: "Incorrect username.",
					});

				Bcrypt.compare(password, user.password, function (err, res) {
					if (err) return done(err);
					if (res === false)
						return done(null, false, {
							message: "Incorrect password.",
						});

					return done(null, user);
				});
			});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}; */
