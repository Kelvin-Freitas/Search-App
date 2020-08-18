const express = require("express");
const routes = express.Router();
const {isLogged} = require("../helpers/isLogged");
const {isAdmin} = require("../helpers/isAdmin");


//controllers
const GitController = require("../controllers/GitController");
const LoginController = require("../controllers/LoginController");
const AdminController = require("../controllers/AdminController");

//Home routes
routes.get("/",(req,res)=>{
    if(res.locals.user===null){
        return res.render("index");
    }else{
        if(res.locals.user.admin===true){
            return res.render("index",{admin:true});
        }else{
            return res.render("index",{admin:false});
        }
    }
})

//Github routes
routes.get('/github/repositorios',GitController.repositorios);
routes.get('/github/usuarios',GitController.usuarios);
routes.get('/github/comentarios',isLogged,GitController.comentariosGet);
routes.post('/github/userRepos',isLogged,GitController.userRepos);
routes.post('/github/comentarios',isLogged,GitController.comentarios);
routes.post('/github/store',isLogged,GitController.store);


//Login routes
routes.get('/login',LoginController.index);
routes.get('/login/register',LoginController.register);
routes.get('/logout',LoginController.logout);
routes.post('/login',LoginController.login);
routes.post('/login/store',LoginController.store);

//Admin routes
routes.post('/admin/deletePost',isLogged,isAdmin,AdminController.deletePost)
routes.post('/admin/store',isLogged,isAdmin,AdminController.storeAdm)
routes.get('/admin/cadastrar',isLogged,isAdmin,AdminController.cadastrarAdm)


module.exports = routes;