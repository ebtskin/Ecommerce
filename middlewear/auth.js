/** @format */

module.exports = {
	ensureAuth: function (req, res, next) {
		if (req.isAuthenticated() && req.user.username =='Admin'){
			res.redirect('/admin');
		}
		else if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/");
		}
	},

	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect("/account");
		} else {
			return next();
		}
	},

	ensureAdmin: function(req, res, next) {
		if (req.isAuthenticated() && req.user.username == 'Admin') {
			return next()
		} else if (req.isAuthenticated()){
			res.redirect('/account');
		} else {
			res.redirect('/');
		}
	}
};
