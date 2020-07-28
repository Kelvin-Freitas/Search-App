const mongoose = require("mongoose");
const axios = require("axios");

const api = axios.create({
    baseURL: 'https://api.github.com',
});

module.exports = {
    async repository(req,res){
        try {
            const repo = await api.get(`/search/repositories?q=${req.body.repository}`);
            return res.send(repo.data);
        } catch (error) {
            res.send(error)
        }
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