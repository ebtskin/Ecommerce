/** @format */

const authenticateUser = async (email, password, done) => {
	console.log(email);
	const regUser = await User.findOne({ email: email });
	console.log(regUser);

	if (regUser == null) {
		return done(null, false, {
			message: "No user with that email",
		});
	}

	try {
		console.log(password + " -> " + regUser.password);
		if (await bcrypt.compare(password, regUser.password)) {
			return done(null, regUser);
		} else {
			return done(null, false, { message: "Password incorrect" });
		}
	} catch (e) {
		return done(e);
	}
};

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
