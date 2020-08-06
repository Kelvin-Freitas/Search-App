const express = require("express");
const routes = express.Router();

//controllers
const GitController = require("../controllers/GitController");
const LoginController = require("../controllers/LoginController");

//Home routes
routes.get("/",(req,res)=>{
    res.render("index");
})

//Github routes
routes.get('/github/repositorios',GitController.repositorios);
routes.get('/github/usuarios',GitController.usuarios);
routes.post('/github/comentarios',GitController.comentarios);


//Login routes
routes.get('/login',LoginController.index);
routes.get('/login/register',LoginController.register);
routes.post('/login/store',LoginController.store);


module.exports = routes;