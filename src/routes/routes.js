const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//controllers
const GitController = require("../controllers/GitController");
const LoginController = require("../controllers/LoginController");

//Home routes
router.get("/",(req,res)=>{
    res.render("index");
})

//Github routes
router.get('/github',GitController.index);

//Login routes
router.get('/login',LoginController.index);

module.exports = router;