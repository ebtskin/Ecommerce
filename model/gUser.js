/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	googleId: {
		type: String,
		default: null
	},
	displayName: {
		type: String,
		default: null
	},
	firstName: {
		type: String,
		default: null
	},
	lastName: {
		type: String,
		default: null
	},
	username: {
		type: String,
		default: null
	},
	password: {
		type: String,
		default: null
	},
	image: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	products: [mongoose.SchemaTypes.ObjectId],

	userType: {
		type: String,
		default: "regular",
		required: true
	},
});

module.exports = mongoose.model("regularUser", UserSchema);
