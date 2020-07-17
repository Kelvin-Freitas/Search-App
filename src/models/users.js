const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Users = new schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model("users",Users);