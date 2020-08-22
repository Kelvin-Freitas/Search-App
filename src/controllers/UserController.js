const mongoose = require('mongoose')
const User = mongoose.model("users");

module.exports = {
    async myProfile(req,res){
        const userEmail = res.locals.user.email;
        await User.findOne({email:userEmail}).lean().then((myUser)=>{
            return res.render('user/meuperfil',{user:myUser});
        }).catch((err)=>{
            req.flash("error_msg","Desulpe-me! Mas algo de errado aconteceu, tente novamente!")
            return res.redirect('/');
        })
    }
}