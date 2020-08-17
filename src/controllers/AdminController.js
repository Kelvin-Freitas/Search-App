const mongoose = require("mongoose");
const url = require("url");
const Posts = mongoose.model("Posts");
const Comments = mongoose.model("Comments");

module.exports = {
    deletePost(req,res){
        const commentId = req.body.id;
        Comments.remove({_id:commentId}).then(()=>{
            req.flash("success_msg","Comentário apagado com sucesso!");
            return res.redirect('/github/repositorios')
        }).catch((err)=>{
            req.flash("error_msg","Não foi possível apagar esse post. Tente novamente!");
            return res.redirect('/github/repositorios')
        })
    }
}