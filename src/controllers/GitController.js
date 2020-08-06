const mongoose = require("mongoose");
const axios = require("axios");

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
    comentarios(req,res){
        const tipo = req.body.tipo;
        if(tipo==null || typeof tipo==undefined){
            return res.render("/");
        }
        if(req.body.id==null || req.body.id==undefined){
            return res.render("github/"+tipo);
        }else{
            const id = req.body.id;
            //busca no mongoose por comentarios
            return res.render("github/comentarios");
        }
    }
}