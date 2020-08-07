module.exports = {
    isLogged: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error_msg","Você deve fazer login para acessar essa página!");
            res.redirect("/login");
        }
    }
}