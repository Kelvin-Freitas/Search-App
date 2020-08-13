const mongoose = require("mongoose");
const axios = require("axios");
const url = require("url");
const Posts = mongoose.model("Posts");
const Comments = mongoose.model("Comments");

const api = axios.create({
    baseURL: 'https://api.github.com',
});

module.exports = {
    async repositorios(req,res){
        if(req.query.repository==null || typeof req.query.repository==undefined){
            return res.render("github/repositorios");
        }else{
            try {
                const repo = await api.get(`/search/repositories?q=${req.query.repository}`);
                const lista = [];
                repo.data.items.forEach(item => {
                    const {id,full_name,owner:{login,avatar_url},description,svn_url,language}= item;
                    lista.push({
                        id,
                        full_name,
                        login,
                        avatar_url,
                        description,
                        svn_url,
                        language
                    });
                });
                return res.render("github/repositorios",{lista:lista});
            } catch (error) {
                return res.send(error);
            }
        }
    },
    async usuarios(req,res){
        if(req.query.user==null || typeof req.query.user==undefined){
            return res.render("github/usuarios");
        }else{
            try {
                const users = await api.get(`/search/users?q=${req.query.user}`);
                const lista = [];
                users.data.items.forEach(item => {
                    const {id,login,avatar_url,html_url} = item;
                    lista.push({
                        id,
                        login,
                        avatar_url,
                        html_url
                    });
                });
                return res.render("github/usuarios",{lista:lista});
            } catch (error) {
                return res.send(error);
            }
        }
    },
    async comentarios(req,res){
        const tipo = req.body.tipo;
        const userAdm = res.locals.user.admin;
        if(tipo==null || typeof tipo==undefined){
            return res.render("/");
        }
        if(req.body.id==null || req.body.id==undefined){
            return res.render("/");
        }else{
            const id = req.body.id;
            await Posts.findOne({name_type:tipo,id_type:id}).then((post)=>{
                if(post){
                    Comments.find({type_id:post._id}).populate('user_id','name').lean().then((commentsList)=>{
                        return res.render("github/comentarios",{tipo:tipo,id:id,commentsList:commentsList,userAdm:userAdm})
                    }).catch((err)=>{
                        req.flash("error_msg","Desculpe, houve um erro ao tentar carregar os comentários desse post!");
                        return res.redirect(req.get('referer'));
                    })
                }else{
                    return res.render("github/comentarios",{tipo:tipo, id:id});
                }
            })
        }
    },
    async comentariosGet(req,res){
        const tipo = req.query.tipo;
        const id = req.query.id;
        if(tipo==null || typeof tipo==undefined || tipo==""){
            return res.redirect("/");
        }else if(id==null || typeof id==undefined || id==""){
            return res.redirect("/");
        }else{
            await Posts.findOne({name_type:tipo,id_type:id}).then((post)=>{
                if(post){
                    Comments.find({type_id:post._id}).populate('user_id','name').lean().then((commentsList)=>{
                        return res.render("github/comentarios",{tipo:tipo,id:id,commentsList:commentsList})
                    }).catch((err)=>{
                        req.flash("error_msg","Desculpe, houve um erro ao tentar carregar os comentários desse post!");
                        return res.redirect(req.get('referer'));
                    })
                }else{
                    return res.render("github/comentarios",{tipo:tipo, id:id});
                }
            })
        }
    },
    store(req,res){
        const name_type = req.body.tipo;
        const id_type = req.body.id;
        const comment = req.body.comment;
        if(comment===null || comment===undefined || comment==""){
            req.flash("error_msg","Desculpe, acho que você esqueceu de escrever seu comentário, tente novamente!");
            return res.redirect(url.format({
                pathname: "/github/comentarios",
                query:{
                    "id":id_type,
                    "tipo": name_type
                }
            }));
        }else{
            Posts.findOne({id_type:id_type,name_type:name_type}).then((post)=>{
                if (post) {
                    const type_id = post._id;
                    const newComment = new Comments({
                        comment,
                        type_id,
                        user_id: res.locals.user._id
                    }).save().then(()=>{
                        req.flash("success_msg","Seu comentário foi postado com sucesso!");
                        return res.redirect(url.format({
                            pathname: "/github/comentarios",
                            query:{
                                "id":id_type,
                                "tipo": name_type
                            }
                        }));
                    }).catch((err)=>{
                        req.flash("error_msg","Desculpe! Mas houve um erro ao tentar salvar seu comentário, tente novamente.");
                        return res.redirect(url.format({
                            pathname: "/github/comentarios",
                            query:{
                                "id":id_type,
                                "tipo": name_type
                            }
                        }));
                    })
                } else {
                    const newPost = new Posts({
                        name_type,
                        id_type
                    }).save().then(()=>{
                        Posts.findOne({id_type:id_type,name_type:name_type}).then((post)=>{
                            if(post){
                                const type_id = post._id;
                                const newComment = new Comments({
                                    comment,
                                    type_id,
                                    user_id: res.locals.user._id
                                }).save().then(()=>{
                                    req.flash("success_msg","Seu comentário foi criado com sucesso!");
                                    return res.redirect(url.format({
                                        pathname: "/github/comentarios",
                                        query:{
                                            "id":id_type,
                                            "tipo": name_type
                                        }
                                    }));
                                }).catch((err)=>{
                                    req.flash("error_msg","Desculpe! Mas houve um erro ao tentar criar seu comentário, tente novamente.");
                                    return res.redirect(url.format({
                                        pathname: "/github/comentarios",
                                        query:{
                                            "id":id_type,
                                            "tipo": name_type
                                        }
                                    }));
                                })
                            }
                        })
                    }).catch((err)=>{
                        console.log(err)
                        req.flash("error_msg","Desculpe! Mas houve um erro ao tentar criar seu post, tente novamente.");
                        return res.redirect(url.format({
                            pathname: "/github/comentarios",
                            query:{
                                "id":id_type,
                                "tipo": name_type
                            }
                        }));
                    })
                }
            }).catch((err)=>{
                req.flash("error_msg","Houve um erro ao salvar os dados, por favor, tente novamente!");
                return res.redirect(url.format({
                    pathname: "/github/comentarios",
                    query:{
                        "id":id_type,
                        "tipo": name_type
                    }
                }));
            })
        }
    }
}