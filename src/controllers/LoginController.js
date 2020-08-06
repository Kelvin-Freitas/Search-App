const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = mongoose.model("users");

module.exports = {
    index(req,res){
        return res.render("login/index");
    },
    register(req,res){
        return res.render("login/register");
    },
    login(req,res,next){
        passport.authenticate("local",{
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
        })(req,res,next)
    },
    store(req,res){
        var errorList = [];
        if(!req.body.name || typeof req.body.name==undefined || req.body.name==null){
            errorList.push({message:"Nome inválido!"})
        }
        if(!req.body.email || typeof req.body.email==undefined || req.body.email==null){
            errorList.push({message:"Email inválido!"})
        }
        if(!req.body.password || typeof req.body.password==undefined || req.body.password==null){
            errorList.push({message:"Senha inválido!"})
        }
        if(req.body.password.length < 8){
            errorList.push({message:"A senha deve possuir no mínimo 8 caracteres!"})
        }
        if(req.body.password != req.body.password2){
            errorList.push({message:"As senhas estão diferentes, por favor, tente novamente!"})
        }
        if (errorList.length > 0) {
            return res.render("login/register",{errorList:errorList});
        } else {
            User.findOne({email:req.body.email}).then((usuario)=>{
                if (usuario) {
                    req.flash("error_msg","Já existe uma conta utilizando esse email!")
                    res.redirect("/login/register")
                } else {
                    const {name,email,password} = req.body;
                    const nUsuario = new User({
                        name,
                        email,
                        password
                    }) 
                    bcrypt.genSalt(10,(erro,salt)=>{
                        bcrypt.hash(nUsuario.senha,salt,(erro,hash)=>{
                            if(erro){
                                req.flash("error_msg","Houve um erro ao salvar seus dados, tente novamente!");
                                res.redirect("/");
                            }else{
                                nUsuario.senha = hash;
                                nUsuario.save().then(()=>{
                                    req.flash("success_msg","Usuário cadastrado com sucesso!");
                                    res.redirect("/login");
                                }).catch((err)=>{
                                    req.flash("error_msg","Desculpe! Mas houve um erro ao tentar te cadastrar, tente novamente.");
                                    res.redirect("/login/register");
                                })
                            }
                        })
                    })
                }
            }).catch((err)=>{
                req.flash("error_msg","Houve um erro ao tentar logar, tente novamente!")
                res.redirect("/")
            })
        }
    }
}