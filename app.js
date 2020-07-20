const express = require("express");
const mongoose = require("mongoose");
const handle = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');

//const path = require("path");
//app.use(express.static(path.join(__dirname,"public")));

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
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
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



//models
require('./src/models/users');

//routes
app.use("/",require("./src/routes/routes"));

app.listen(PORT);