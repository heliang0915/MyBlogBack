var commentManager = require("../db/commentManager");
commentManager = new commentManager();

function getCommentCount(blogId){
    return new Promise((resolve, reject)=>{
        commentManager.find({blogId,type:1}, function (err, comments) {
            if(err){
                reject(err)
            }else {
                resolve(comments.length)
            }
        });
    })
}
module.exports = {
    getCommentCount
}
