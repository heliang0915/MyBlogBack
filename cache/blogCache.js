/**
 *
 * User: heliang
 * Date: 2018/4/26.
 */
var  {blogManager}=require("../db/modelManager");
var  config=require("../config");
var  cache=require("../cache/cache");
var  cacheConst=require("../const/WxConst");
blogManager = new blogManager();

let blogCache={
    page(currentPage, query,sort,ps){
        return new Promise((resolve, reject)=>{
            cache.exists(`${Cache.BLOG}:all`,(err,ext)=>{
                if(ext){
                    cache.get(`${cacheConst.BLOG}:all`,(err,modules)=>{
                        // console.log(modules);
                        var pageSize = ps||config.mongo.pageSize;
                        let total=modules.length;
                        let start=pageSize*(currentPage-1);
                        let end=currentPage*pageSize;
                        end=end>total?total:end;
                        // info.models=modules.slice(start,end);
                        var info={
                            total,
                            pageSize,
                            models:modules.slice(start,end)
                        }

                        //按评论量排序
                        // modules.sort((a,b)=>{
                        //     return b.commentSize-a.commentSize;
                        // })
                        console.log("读取缓存blog");
                        if (err) {
                            reject(err)
                        } else {
                            resolve(info)
                        }

                    })
                }else{
                    blogManager.page(currentPage, query, function (err, info) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(info)
                        }
                    },sort,ps);
                }
            })
        })
    }
}

module.exports=blogCache;