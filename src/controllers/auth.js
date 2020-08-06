const localPassport = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/users")
const User = mongoose.model("users")

module.exports = function(passport){
    passport.use(new localPassport({usernameField: 'email'},(email,password,done)=>{
        User.findOne({email:email}).then((usuario)=>{
            if(!usuario){
                return done(null,false,{message:"A conta informada não existe."});
            }

            bcrypt.compare(password,usuario.password,(erro,success)=>{
                if(success){
                    return done(null,usuario);
                }else{
                    return done(null,false,{message:"Senha incorreta!"});
                }
            })
        })
    }))

    passport.serializeUser((usuario,done)=>{
        done(null,usuario.id);
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,usuario)=>{
            done(err,usuario);
        })
    })
}