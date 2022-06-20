/** @format */

const express = require("express");
const router = express.Router();
const passport = require('passport');

//Google Auth
router.get("/google", passport.authenticate('first', {scope: ['profile']}));


router.get("/google/callback", passport.authenticate('first', {failureRedirect: '/'}), (req, res) =>{
    res.redirect('/account');
})

//Logout 
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if(err) {return next(err)};
        res.redirect('/');
    }); 
})

//Logout 
router.get('/admin', (req, res, next) => {
    req.logout(err => {
        if(err) {return next(err)};
        res.redirect('/');
    }); 
})

module.exports = router;
