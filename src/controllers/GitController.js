const mongoose = require("mongoose");
const axios = require("axios");

const api = axios.create({
    baseURL: 'https://api.github.com',
});

module.exports = {
    async repositorios(req,res){
        if(req.query.repository==null || req.query.repository==undefined){
            return res.render("github/repositorios");
        }else{
            try {
                const repo = await api.get(`/search/repositories?q=${req.query.repository}`);
                const lista = [];
                repo.data.items.forEach(item => {
                    const {full_name,owner:{login,avatar_url},description,svn_url,language}= item;
                    lista.push({
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
    usuarios(req,res){
        return res.render("github/usuarios");
    },
    projetos(req,res){
        return res.render("github/projetos");
    }
}