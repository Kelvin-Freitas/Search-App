const express = require("express");
const mongoose = require("mongoose");
const handle = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
const passport = require("passport");
require("./src/controllers/auth")(passport);


//Express config
const app = express();
const PORT = 3001;
app.use(express.json());

//Session
app.use(session({
    secret:"searchApp",
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next()
})

//Database config
try {
    mongoose.connect("mongodb://localhost:27017/SearchApp",{useNewUrlParser:true,useUnifiedTopology:true});
} catch (error) {
    app.get("/error/500",(req,res)=>{
        res.send("Erro de conexão com banco de dados!")
    });
}

//Handlebars config
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('handlebars',handle({defaultLayout:'main'}));
app.set('views',__dirname+'/src/views');
app.set('view engine','handlebars');

//public
app.use(express.static(path.join(__dirname+"/src/","public")));

//img
app.use(express.static(path.join(__dirname+"/src/","images")));

//models
require('./src/models/users');
require('./src/models/Posts');
require('./src/models/Comments');

//routes
app.use("/",require("./src/routes/routes"));

app.listen(PORT);