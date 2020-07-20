const mongoose = require("mongoose");

const User = mongoose.model("users");

module.exports = {
    index(req,res){
        return res.render("login/index");
    },
    register(req,res){
        return res.render("login/register");
    },
    store(req,res){
        const erros = [];
        if(req.body.nome == null || req.body.nome == undefined){
            erros.push({message:"Nome Inválido!"});
        }
        if(req.body.password === req.body.password2){
            res.send("Aguardando implementacao");
        }else{
            erros.push({message:"As senhas não são iguais, por favor, tente novamente!"});
            res.render("login/register",{erros:erros});
        }
    }
}