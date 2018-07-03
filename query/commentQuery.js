/**
 *时间:2018/5/1
 *作者:heliang
 *功能:评论查询 负责频道增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */
let  cheerio = require("cheerio");
let {commentManager} = require("../db/modelManager");
let {commentCache, blogCache, userCache} = require("../cache/modelCache");
let queryParse = require("../cache/util/queryParse");
let zanQuery = require("../query/zanQuery");
let util = require("../util/util");

commentManager = new commentManager();

/**
 * 获取指定文章的评论数量
 * @param blogId
 * @returns {Promise<any>}
 */
 async  function getCommentCount(blogId) {
   let comments=await  commentCache.find({blogId, type: 1})
   return comments.length;
}


/**
 *获取我的评论
 * @param userId 用户ID
 * @param currentPage 当前页数
 * @param type 类型 默认为1：微信
 * @returns {Promise<*>}
 */
async function getBlogListByUserId(userId, currentPage, type = 1) {
    let blogs = [];
    let tid = -1;
    let query = {type: 1};
    if (type != 1) {
        tid = userId;
    } else {  //type==1 为微信需将userId转换为tid
        let userModel = await userCache.findByUUID(userId);
        tid = userModel.tid;
    }
    query.userId = tid;
    //查询某人的评论信息
    let comments = await  commentCache.find(query);
    console.log("comments:::::::::::"+comments.length);
    for (let commentModel of comments) {

        let {blogId} = commentModel;
        let blog = await blogCache.findByUUID(blogId);
        // let count = await getCommentCount(blogId);
        // let zanCount= await  zanQuery.getZanCountByBlogId(blogId);
        // let desc = "";
        // let $ = cheerio.load(blog.content);
        // let regText = /<p.*?>(.*?)<\/p>/g;
        // let isText = false;
        // blog.content.replace(regText, function (item, small) {
        //     item = small.replace(/&nbsp/g, '').replace(/;/g, '').replace(/<br>/, '');
        //     var $ = cheerio.load(item);
        //     var src = $("img").attr('src');
        //     if (src) {
        //         isText = false;
        //     } else {
        //         if (isText == false && item) {
        //             desc = item;
        //             isText = true;
        //         }
        //     }
        // });
        //描述信息
        // blog.desc = util.stringUtil.substr(desc, 90);
        // blog['commentSize'] = count;
        // blog['zanSize'] = zanCount;

        console.log("blog:::::::::::::::"+JSON.stringify(blog.uuid));
        blogs.push(blog);
    }

    console.log("blog::::去重.............");
    //去重
    blogs = queryParse.getNoRepeatQuery(blogs);

    console.log("blog::::size:::::"+blogs.length);
    //内存分页
    let info = queryParse.getPageQuery(currentPage, blogs);


    return info;
}


/**
 * 评论分页信息
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param pageSize  页容量
 * @returns {Promise<any>}
 */

function pagePromise(currentPage,query,sort,pageSize){
    return commentCache.page(currentPage, query,sort,pageSize);
    // return new Promise((resolve, reject)=>{
    //     channelManager.page(currentPage, query, function(err,modules){
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(modules)
    //         }
    //     },sort,pageSize)
    // })
}

/**
 * 根据频道UUID获取频道信息
 * @param uuid 频道UUID
 * @returns {Promise<any>} 返回Promise对象
 */
function getCommentByUUIDPromise(uuid){
    return commentCache.findByUUID(uuid);

    // return new Promise((resolve, reject)=>{
    //     //查询频道信息
    //     channelManager.findByUUID(uuid,function (err,channel){
    //         if(err){
    //             reject(err)
    //         }else{
    //             resolve(channel)
    //         }
    //     })
    // })
}


/**
 *获取评论列表 根据条件查询 不分页
 * @param query 查询条件
 * @param sort 排序条件
 * @returns {*}
 */
function commentListByQueryPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return commentCache.find(query,sort);
}

/**
 * 保存评论信息
 * @param uuid 评论uuid
 * @param model 保存的评论模型
 * @returns {Promise<any>} promise 对象
 */
function saveCommentPromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            commentManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)

                }
            })

        } else {
            commentManager.add(model, function (err) {
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
 *  删除评论
 * @param uuid 评论uuid
 * @returns {Promise<any>}
 */
function deleteCommentPromise(uuid){
    return new Promise(((resolve, reject) => {
        commentManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}



module.exports={
    getCommentCount,
    getBlogListByUserId,
    getCommentByUUIDPromise,
    commentListByQueryPromise,
    saveCommentPromise,
    deleteCommentPromise,
    pagePromise
}


