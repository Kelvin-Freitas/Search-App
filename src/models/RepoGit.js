const mongoose =  require("mongoose")
const Schema =  mongoose.Schema;

const RepoGit = new Schema({
    id:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    }
})

mongoose.model("RepoGit",RepoGit);