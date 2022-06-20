/** @format */

const express = require("express");
const ProductModel = require("../model/products");
const bodyParser = require("body-parser");
const router = express.Router();
const Admin = require("../model/gUser");
const Bcrypt = require("bcryptjs");
const { ensureAdmin } = require("../middlewear/auth");
const multer = require("multer");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: fileStorageEngine });

router.use(express.json());

router.get("/", ensureAdmin, async (req, res) => {

	let count = 0;

	const user = await Admin.find({});

	user.forEach(i => ++count)

	if (user) {
		res.render("adminIndex", {
			layout: "adminIndex",
			name: req.user.firstName, user: user, count: count
		});
	}
});

router.get("/setup", async (req, res) => {
	const admin = await Admin.findOne({
		username: "Admin",
	});

	if (!admin) {
		res.render("adminSetup", { layout: "userLogin" });
	} else {
		res.redirect("/");
	}
});

router.post("/register", async (req, res) => {
	const admin = await Admin.findOne({
		username: "Admin",
	});
	console.log(req.body);
	if (!admin) {
		try {
			const newUser = await Admin.create({
				username: "Admin",
				firstName: req.body.firstname,
				lastName: req.body.lastname,
				email: req.body.email,
				password: Bcrypt.hashSync(req.body.password, 10),
				userType: "Admin",
			});
			//console.log(newUser);
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

router.get("/products", ensureAdmin, async (req, res) => {
	const admin = await Admin.findOne({ username: "Admin" });
	if (admin) {
		res.render("products", { layout: "adminIndex" });
	} else {
		res.redirect("/");
	}
});

router.post("/upload", ensureAdmin, upload.single("image"), async (req, res) => {
	console.log(req.body);
	if (req.file) {
		const newProduct = new ProductModel({
			name: req.body.productName,
			price: req.body.price,
			description: req.body.description,
			image: req.file.originalname,
			category: req.body.category,
		});

		try {
			await newProduct.save();
			res.send("Successfully Uploaded");
		} catch (e) {
			console.error(e);
		}
	}
});


router.post('/delete', ensureAdmin, async (req,res) => {
	if(req.body.user){
	try{
		await Admin.deleteOne({_id: req.body.user})
		res.redirect('/admin')
	}catch (e){
		console.errors(e)
	}
}
})

router.post('/userCart', ensureAdmin, async (req, res) => {
	if (req.body.user) {
		try {
			const users = await Admin.findOne({ _id: req.body.user });
			console.log(`User is: ${users}`)
			const cart = await ProductModel.findOne({_id: users.products});
			console.log("This is products: " + cart)
			return res.render("viewCart", {layout: 'adminIndex', product: cart, username: users.displayName, userid: users._id});
		} catch (e) {
			console.errors(e);
			return res.render("viewCart", {layout: 'adminIndex'})
		}
	}
})

router.post("/remove/cart", ensureAdmin, async (req, res) => {
	if (req.body.user) {
		try {
			const users = await Admin.findOne({ _id: req.body.user });
			await users.deleteOne({products});
			return res.render("viewCart", { layout: "adminIndex" });
		} catch (e) {
			console.errors(e);
		}
	}
});



module.exports = router;
