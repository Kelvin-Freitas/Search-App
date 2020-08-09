const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Posts = new schema({
    name_type:{
        type: String,
        required: true
    },
    id_type:{
        type: String,
        required: true
    }
})

mongoose.model("Posts",Posts);