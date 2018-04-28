let config=require("../config");
var  {zanManager}=require("../db/modelManager");
var  {zanCache,blogCache}=require("../cache/modelCache");
var  queryParse=require("../cache/util/queryParse");
var  util=require("../util/util");
var  cheerio=require("cheerio");
zanManager=new zanManager();

function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            zanManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
                //更新zan缓存
                zanCache.reload();
            })

        } else {
            // model=uuid;
            zanManager.add(model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
                //更新zan缓存
                zanCache.reload();
            })
        }
    })

}

function getZanByUserIdAndBlogId(userId,blogId) {
    return new Promise((resolve, reject)=>{
        zanManager.find({userId, blogId},(err,zanModules)=>{
            if (err) {
                reject(err)
            } else {
                resolve(zanModules)
            }
        })
    })
}

function getZanCountByBlogId(blogId) {
    return new Promise((resolve, reject)=>{
        zanManager.find({blogId},(err,zanModules)=>{
            if (err) {
                reject(err)
            } else {
                resolve(zanModules.length)
            }
        })
    })
}

//点击赞或取消赞
async function changeZanPromise(userId,blogId,isZan){
    //1.根据userId和blogId查询是否有点赞记录
    let modules=await getZanByUserIdAndBlogId(userId,blogId);
    if(modules.length>0){
    //2.设置是否为赞的标志
        let module=modules[0];
        module.isZan=isZan;
        await savePromise(module.uuid,module);
    }else{
        // 创建记录 并设置为点赞
        await savePromise(null,{
            userId,
            blogId,
            isZan
        });
    }
}
//根据用户id和blogId获取当前文章是否点赞
async  function isZanPromise(userId,blogId) {
    let modules=await getZanByUserIdAndBlogId(userId,blogId);
    if(modules.length>0){
        let module=modules[0];
        return module.isZan;
    }else{
       return false;
    }
}

//查询指定用户下点赞文章
async function  getArticleByUserId(userId,currentPage,sort){
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;

    //获取所有的赞信息
    let zanModels =await  zanCache.find({userId},sort);

    let blogModels=[];
    for(let zanModel of zanModels){
        let blogModel= await  blogCache.findByUUID(zanModel.blogId);
        var desc="";
        var $=cheerio.load(blogModel.content);
        var regText=/<p.*?>(.*?)<\/p>/g;
        let isText=false;
        blogModel.content.replace(regText,function(item,small){
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
        blogModel.desc= util.stringUtil.substr(desc,90);
        blogModels.push(blogModel);
    }
    //内存分页
    let info=queryParse.getPageQuery(currentPage,blogModels);
    return info;
}


module.exports={
    savePromise,
    isZanPromise,
    getZanCountByBlogId,
    getArticleByUserId,
    changeZanPromise
}