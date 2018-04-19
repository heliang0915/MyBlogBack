var  articleManager=require("../db/blogManager");
articleManager=new articleManager();



//获取文章列表
function articleListPromise(currentPage,query){
    return new Promise((resolve, reject)=>{
        articleManager.page(currentPage, query, function(err,info){
            if(err){
                reject(err)
            }else{
                resolve(info)
            }
        });
    })
}

module.exports={
    articleListPromise
}
