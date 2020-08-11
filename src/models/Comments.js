const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Comments = new Schema({
    comment:{
        type: String,
        required: true
    },
    type_id:{
        type: Schema.Types.ObjectId,
        ref: "Posts",
        required: true
    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

mongoose.model("Comments",Comments);