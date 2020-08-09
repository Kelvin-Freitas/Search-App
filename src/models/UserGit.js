const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserGit = new Schema({
    id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
})

mongoose.model("UserGit",UserGit);