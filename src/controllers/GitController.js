const mongoose = require("mongoose");
const request = require("request");

module.exports = {
    index(req,res){
        return res.render("github/index");
    }
}