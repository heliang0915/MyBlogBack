/**
 *时间:2018/5/1
 *作者:heliang
 *功能:赞查询 负责频道增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */

// let config=require("../config");
var  {zanManager}=require("../db/modelManager");
var  {zanCache,blogCache,commentCache}=require("../cache/modelCache");
var  queryParse=require("../cache/util/queryParse");
var  util=require("../util/util");
var  cheerio=require("cheerio");
zanManager=new zanManager();

/**
 * 保存赞的信息
 * @param uuid zan的UUID
 * @param model zan模型
 * @returns {Promise<any>} 返回Promise
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            zanManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })

        } else {
            // model=uuid;
            zanManager.add(model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })
        }
    })

}

/**
 * 根据用户ID和文章ID获取赞的集合
 * @param userId
 * @param blogId
 * @returns {Promise<any>}
 */
function getZanByUserIdAndBlogId(userId,blogId) {
   return  zanCache.find({userId, blogId})
    // return new Promise((resolve, reject)=>{
    //     zanManager.find({userId, blogId},(err,zanModules)=>{
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(zanModules)
    //         }
    //     })
    // })
}


/**
 * 根据文章ID获取zan的数量
 * @param blogId 文章ID
 * @returns {Promise<any>}
 */
async  function getZanCountByBlogId(blogId) {
   let zanModules=await zanCache.find({ blogId});
   return zanModules.length;

    // return new Promise((resolve, reject)=>{
    //     zanManager.find({blogId},(err,zanModules)=>{
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(zanModules.length)
    //         }
    //     })
    // })
}
async  function getCommentCountByBlogId(blogId) {
    let commentModules=await commentCache.find({blogId, type: 1});
    return commentModules.length;

    // return new Promise((resolve, reject)=>{
    //     zanManager.find({blogId},(err,zanModules)=>{
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(zanModules.length)
    //         }
    //     })
    // })
}



/**
 * 点击赞或取消赞
 * @param userId 用户ID
 * @param blogId 文章ID
 * @param isZan 是否赞
 * @returns {Promise<void>} 返回promise对象
 */
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
/**
 * 根据用户id和blogId获取当前文章是否点赞
 * @param userId  用户ID
 * @param blogId  文章ID
 * @returns {Promise<*>}
 */
async  function isZanPromise(userId,blogId) {
    let modules=await getZanByUserIdAndBlogId(userId,blogId);
    if(modules.length>0){
        let module=modules[0];
        return module.isZan;
    }else{
       return false;
    }
}

/**
 * 查询指定用户下点赞文章
 * @param userId 用户ID
 * @param currentPage 当前页数
 * @param sort 排序字段
 * @returns {Promise<*>} Promise对象
 */
async function  getArticleByUserId(userId,currentPage,sort){
    let defaultSort={
        order:-1
    }
    console.log(`getArticleByUserId........`)
    sort=sort==null?defaultSort:sort;

    //获取所有的赞信息
    let zanModels =await  zanCache.find({userId},sort);

    let blogModels=[];

    console.log(`zanModels:${zanModels.length}`);

    for(let zanModel of zanModels){
        let blogModel= await  blogCache.findByUUID(zanModel.blogId);
        // console.log(`blogModel>>>>>>>:${JSON.stringify(commentQuery)}`);
        let count = await getCommentCountByBlogId(blogModel.uuid);
        console.log(`count>>>>>>>:${count}`);
        let zanCount= await  getZanCountByBlogId(zanModel.blogId);
        console.log(`zanCount>>>>>>>:${zanCount}`);

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
        blogModel['commentSize'] =count;
        blogModel['zanSize'] = zanCount;
        blogModels.push(blogModel);
    }
    // zanModels.forEach(async (zanModel)=>{
    //
    // })

    // }

    console.log(blogModels.length);
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
