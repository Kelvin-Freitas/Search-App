const mongoose = require("mongoose");
//const request = require("request");


module.exports = {
    repositorios(req,res){
        return res.render("github/repositorios");
    },
    usuarios(req,res){
        return res.render("github/usuarios");
    },
    projetos(req,res){
        return res.render("github/projetos");
    }
}