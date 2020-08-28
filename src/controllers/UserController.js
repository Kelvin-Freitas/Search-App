const mongoose = require('mongoose')
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = mongoose.model("users");

module.exports = {
    async config(req,res){
        const userEmail = res.locals.user.email;
        await User.findOne({email:userEmail}).lean().then((myUser)=>{
            return res.render('user/meuperfil',{user:myUser});
        }).catch((err)=>{
            req.flash("error_msg","Desulpe-me! Mas algo de errado aconteceu, tente novamente!")
            return res.redirect('/');
        })
    },
    profile(req,res){
        const userEmail = res.locals.user.email;
        User.findOne({email:userEmail}).lean().then((myUser)=>{
            return res.render('user/perfil',{user:myUser,myprofile:true});
        }).catch((err)=>{
            req.flash("error_msg","Desulpe-me! Mas algo de errado aconteceu, tente novamente!")
            return res.redirect('/');
        })
    },
    showProfile(req,res){
        const userEmail = req.body.email;
        User.findOne({email:userEmail}).lean().then((myUser)=>{
            return res.render('user/perfil',{user:myUser});
        }).catch((err)=>{
            req.flash("error_msg","Desulpe-me! Mas algo de errado aconteceu, tente novamente!")
            return res.redirect('/');
        })
    },
    changePhoto(req,res){
        return res.redirect('/')
    },
    changePassword(req,res){
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        const userEmail = res.locals.user.email;

        if(typeof currentPassword==undefined || currentPassword==null ||
            typeof newPassword==undefined || newPassword==null ||
            typeof confirmPassword==undefined || confirmPassword==null){
            req.flash('error_msg','Os campos não podem estar vazios!')
        }else{
            if(newPassword.length<8){
                req.flash('error_msg','Sua senha deve ter no mínimo 8 caracteres!')
            }else if(newPassword!=confirmPassword){
                req.flash('error_msg','Você deve repetir a nova senha no ultimo campo!')
            }else{
                User.findOne({email:userEmail}).then((user)=>{
                    if(user.password===currentPassword){
                        bcrypt.genSalt(10,(erro,salt)=>{
                            bcrypt.hash(confirmPassword,salt,(erro,hash)=>{
                                if(erro){
                                    req.flash("error_msg","Houve um erro ao salvar sua senha, tente novamente!");
                                }else{
                                    user.password = hash;
                                    user.save().then(()=>{
                                        req.flash("success_msg","Senha salva com sucesso!");
                                    }).catch((err)=>{
                                        req.flash("error_msg","Desculpe! Mas houve um erro ao tentar salvar, tente novamente!");
                                    })
                                }
                            })
                        })
                    }else{
                        req.flash('error_msg','Você não digitou corretamente sua senha atual, tente novamente!')
                    }
                })
            }
        }
        return res.redirect("/user/meu-perfil");
    },
    changeUsername(req,res){
        const username = req.body.username;
        const userEmail = res.locals.user.email;
        
        if(typeof username==undefined || username==null){
            req.flash('error_msg','O campo não pode estar vazio!')
        }else if(username===res.locals.name){
            req.flash('error_msg','Este nome já é utilizado pelo(a) senhor(a)!')
        }else{
            User.findOne({name:username}).then((user)=>{
                if(user){
                    req.flash('error_msg','Este nome já está sendo utilizado')
                }else{
                    User.findOne({email:userEmail}).then((myuser)=>{
                        if(myuser){
                            myuser.name=username;
                            myuser.save().then(()=>{
                                req.flash("success_msg","Nome alterado com sucesso!");
                            }).catch((err)=>{
                                req.flash('error_msg','Desculpe mas houve um erro ao tentar salvar seu nome!')
                            })
                        }
                    })
                }
            })
        }
        return res.redirect("/user/meu-perfil");
    },
    deleteAccount(req,res){
        const userEmail = res.locals.user.email;
        req.logout();
        User.remove({email:userEmail}).then(()=>{
            req.flash("success_msg","Que pena que você está nos deixando, espero que tenha aproveitado o momento que passou aqui, volte sempre!");
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao tentar deletar sua conta, tente novamente mais tarde!')
        })
        return res.redirect("/");
    },
    changeInfo(req,res){
        const userEmail = res.locals.user.email;
        const nFullname = req.body.fullname;
        const nBio = req.body.bio;
        const nEstado = req.body.estado;
        const nUrl = req.body.url;
        User.findOne({email:userEmail}).then((user)=>{
            user.fullname = nFullname;
            user.bio = nBio;
            user.estado = nEstado;
            user.url = nUrl;
            user.save().then(()=>{
                req.flash('success_msg','Dados alterados com sucesso!')
            }).catch((err)=>{
                req.flash('error_msg','Desculpe houve um erro interno, tente novamente.')
            })
        }).catch((err)=>{
            req.flash('error_msg','Desculpe houve um erro interno, tente novamente mais tarde.')
        })
        return res.redirect("/user/meu-perfil");
    }
}