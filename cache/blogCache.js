/**
 *
 * User: heliang
 * Date: 2018/4/26.
 */
var  {blogManager}=require("../db/modelManager");
var  config=require("../config");
var cacheManager=require("../cache/cacheManager");
var  cache=require("../cache/cache");
var  queryParse=require("../cache/queryParse");
var  cacheConst=require("../cache/WxConst");
console.log(`cacheConst:${cacheConst.BLOG}`)
blogManager = new blogManager();

let blogCache={
    //内存分页
    page(currentPage, query,sort,ps){
        return new Promise((resolve, reject)=>{
            cache.exists(`blog:all`,(err,ext)=>{
                if(ext){
                    cache.get(`blog:all`,(err,modules)=>{
                        var pageSize = ps||config.mongo.pageSize;
                        let total=modules.length;
                        let start=pageSize*(currentPage-1);
                        let end=currentPage*pageSize;
                        end=end>total?total:end;
                        let filed=Object.keys(sort)[0];
                        let val=sort[filed];

                        //查询
                        modules=queryParse.filterByQuery(query,modules)
                        //排序
                        modules.sort((a,b)=>{
                            return (a[filed]-b[filed])*val;
                        })
                        var info={
                            total,
                            pageSize,
                            models:modules.slice(start,end)
                        }
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
    },
    reload(){
        cacheManager.blogAll();
        console.log("blog缓存更新...");
    }
}

module.exports=blogCache;