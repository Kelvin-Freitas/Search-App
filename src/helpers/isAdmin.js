module.exports = {
    isAdmin: function(req,res,next){
        if(res.locals.user.admin===true){
            return next();
        }else{
            req.flash("error_msg","Somente administradores possuem acesso a essa página!");
            res.redirect("/");
        }
    }
}