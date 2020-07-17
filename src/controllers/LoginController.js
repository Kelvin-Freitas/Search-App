const mongoose = require("mongoose");

module.exports = {
    index(req,res){
        return res.render("login/index");
    }
}