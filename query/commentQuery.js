var  {commentManager}=require("../db/modelManager");
var  {commentCache,blogCache,userCache}=require("../cache/modelCache");
var  queryParse=require("../cache/util/queryParse");
var  util=require("../util/util");
var  cheerio=require("cheerio");
commentManager = new commentManager();

//获取指定文章的评论数量
function getCommentCount(blogId){
    return new Promise((resolve, reject)=>{

        // commentManager.find({blogId,type:1}, function (err, comments) {
        //     if(err){
        //         reject(err)
        //     }else {
        //         resolve(comments.length)
        //     }
        // });

        commentCache.find({blogId,type:1}).then((comments)=>{
            resolve(comments.length);
        }).catch(()=>{
            reject(err)
        })

    })
}


//获取我的评论
async function getBlogListByUserId(userId,currentPage,type=1){
    let blogs=[];
    //type==1 为微信需将userId转换为tid
    let tid=-1;
    let query={type:1};
    if(type!=1){
        tid=userId;
    }else{
        let userModel=await userCache.findByUUID(userId);
        tid=userModel.tid;
    }

    query.userId=tid;

    //查询某人的评论信息
     let comments= await  commentCache.find(query);
     console.log(query);
     for(let commentModel of comments){
        let {blogId}= commentModel;
        let blog= await blogCache.findByUUID(blogId);

         var desc="";
         var $=cheerio.load(blog.content);
         var regText=/<p.*?>(.*?)<\/p>/g;
         let isText=false;
         blog.content.replace(regText,function(item,small){
             item=small.replace(/&nbsp/g,'').replace(/;/g,'').replace(/<br>/,'');
             var $=cheerio.load(item);
             var src=$("img").attr('src');
             if(src){
                 isText=false;
             }else{
                 if(isText==false&&item){
                     desc=item;
                     isText=true;
                 }
             }
         });
         //描述信息
         blog.desc= util.stringUtil.substr(desc,90);
        blogs.push(blog);
     }
    //去重
    blogs=queryParse.getNoRepeatQuery(blogs);
    //内存分页
    let info=queryParse.getPageQuery(currentPage,blogs);
    return info;
}


module.exports = {
    getCommentCount,
    getBlogListByUserId
}


