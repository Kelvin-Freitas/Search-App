const mongoose = require("mongoose");
const url = require("url");
const bcrypt = require("bcryptjs");
const Posts = mongoose.model("Posts");
const Comments = mongoose.model("Comments");

module.exports = {
    deletePost(req,res){
        const commentId = req.body.id;
        Comments.remove({_id:commentId}).then(()=>{
            req.flash("success_msg","Comentário apagado com sucesso!");
            return res.redirect('/github/repositorios')
        }).catch((err)=>{
            req.flash("error_msg","Não foi possível apagar esse post. Tente novamente!");
            return res.redirect('/github/repositorios')
        })
    },
    cadastrarAdm(req,res){
        return res.render('admin/cadastrar');
    },
    storeAdm(req,res){
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
            return res.render("admin/cadastrar",{errorList:errorList});
        } else {
            User.findOne({email:req.body.email}).then((usuario)=>{
                if (usuario) {
                    req.flash("error_msg","Já existe uma conta utilizando esse email!")
                    res.redirect("/admin/cadastrar")
                } else {
                    const {name,email,password} = req.body;
                    const nUsuario = new User({
                        name,
                        email,
                        password,
                        admin: true
                    }) 
                    bcrypt.genSalt(10,(erro,salt)=>{
                        bcrypt.hash(nUsuario.password,salt,(erro,hash)=>{
                            if(erro){
                                req.flash("error_msg","Houve um erro ao salvar seus dados, tente novamente!");
                                res.redirect("/");
                            }else{
                                nUsuario.password = hash;
                                nUsuario.save().then(()=>{
                                    req.flash("success_msg","Administrador cadastrado com sucesso!");
                                    res.redirect("/login");
                                }).catch((err)=>{
                                    req.flash("error_msg","Desculpe! Mas houve um erro ao tentar te cadastrar, tente novamente.");
                                    res.redirect("/admin/cadastrar");
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