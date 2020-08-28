const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Users = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:false
    },
    bio:{
        type:String,
        required:false
    },
    estado:{
        type:String,
        required:false
    },
    url:{
        type:String,
        required:false
    },
    admin:{
        type: Boolean,
        default: false
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model("users",Users);