const express = require("express");
const mongoose = require("mongoose");
const handle = require("express-handlebars");
const bodyParser = require("body-parser");

//const path = require("path");
//app.use(express.static(path.join(__dirname,"public")));

//Express config
const app = express();
const PORT = 3001;
app.use(express.json());

//Database config
//mongoose.connect("https://localhost:27017/SearchApp",{useNewUrlParser:true,useUnifiedTopology:true});

//Handlebars config
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('handlebars',handle({defaultLayout:'main'}));
app.set('views',__dirname+'/src/views');
app.set('view engine','handlebars');


app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(PORT);