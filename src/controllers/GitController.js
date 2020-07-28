const mongoose = require("mongoose");
const axios = require("axios");


module.exports = {
    repository(req,res){
        //const resp = await axios.get(`https://api.github.com/repositories?since=364`);
        return res.send("resp");
    },
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