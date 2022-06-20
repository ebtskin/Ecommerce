/** @format */

const express = require("express");
const ProductModel = require("../model/products");
const UserModel = require("../model/gUser");
const User = require("../model/User");
const products = require("../model/products");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());

router.post('/cart', async (req, res) => {

	if(req.body.cart){
		const user = await UserModel.findOne({_id: req.user._id});
		await user.updateOne({products: req.body.cart});
		res.redirect('/user/cart')
	}
	res.status(200);
})

router.get('/cart', async (req, res) => {

	const {products} = await UserModel.findOne({_id: req.user._id});

	if(products){
		const {name, price, description, category, image} = await ProductModel.findOne({_id: products});
		return res.render("cart", {layout: 'cart', name, price, description, category, image});
	}
})



module.exports = router;
