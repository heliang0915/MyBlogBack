/**
 * 业务cache 所有的业务模型 缓存类 其中含有分页 page 方法
 * User: heliang
 * Date: 2018/4/26.
 */

var  config=require("../config");
var  cacheManager=require("./core/cacheManager");
var  cache=require("./core/cache");
var  queryParse=require("./util/queryParse");
var  {cacheAry}=require("./const/cacheConst");
var  modelManager=require("../db/modelManager");


for(let manager in modelManager){
    let fn=`
    let ${manager} =modelManager.${manager} ; 
    ${manager}=new ${manager}();
    global.${manager}=${manager};
     `
    // console.log(`fn:${fn}`);
    eval(fn);
}


cacheAry.forEach(function (item,index){
    let fnPrefix= Object.keys(item)[0];
    let text=item[fnPrefix];
    let fn=`let ${fnPrefix}Cache={
            //内存分页
            page(currentPage, query,sort,ps){
                return new Promise((resolve, reject)=>{
                    cache.exists('${fnPrefix}:all',(err,ext)=>{
                        if(ext){
                            cache.get('${fnPrefix}:all',(err,modules)=>{
                                var pageSize = ps||config.mongo.pageSize;
                                let total=modules.length;
                                let start=pageSize*(currentPage-1);
                                let end=currentPage*pageSize;
                                end=end>total?total:end;
                                let filed=Object.keys(sort)[0];
                                let val=sort[filed];
        
                                //查询
                                if(Object.keys(query).length){
                                    modules=queryParse.filterByQuery(query,modules)
                                }
                                //排序
                                if(Object.keys(sort).length){
                                    modules.sort((a,b)=>{
                                        
                                        return (a[filed]-b[filed])*val;
                                    })
                                }
                                var info={
                                    total,
                                    pageSize,
                                    models:modules.slice(start,end)
                                }
                                console.log("读取缓存${fnPrefix}");
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(info)
                                }
                            })
                        }else{
                            ${fnPrefix}Manager.page(currentPage, query, function (err, info) {
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
                cacheManager.${fnPrefix}All();
                console.log("更新${text}缓存...");
            },
            
            findByUUID(uuid){
                return new Promise((resolve, reject)=>{
                    cache.exists('${fnPrefix}:all',(err,ext)=>{
                        if(ext){
                         
                            cache.get('${fnPrefix}:all',(err,modules)=>{
                            console.log("findByUUID缓存查询....");
                               let module= modules.filter((item)=>{
                                    return item.uuid==uuid;
                               })[0];  
                                 if (err) {
                                    reject(err)
                                } else {
                                    resolve(module)
                                } 
                            });
                        }else{
                             blogManager.findByUUID(uuid, function (err, module) {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(module)
                                }
                            });
                        }
                    });
                    
                });
            },
            find(query,sort){
                return new Promise((resolve, reject)=>{
                    cache.exists('${fnPrefix}:all',(err,ext)=>{
                        if(ext){
                            cache.get('${fnPrefix}:all',(err,modules)=>{
                                if(sort==null){
                                    sort={
                                        order:-1
                                    }
                                }
                                let filed=Object.keys(sort)[0];
                                let val=sort[filed];
                                //查询
                                modules=queryParse.filterByQuery(query,modules)
                                //排序
                                modules.sort((a,b)=>{
                                    return (a[filed]-b[filed])*val;
                                })
                                
                                console.log("调用[find]读取${fnPrefix}缓存");
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(modules)
                                }
                            })
                        }else{
                            ${fnPrefix}Manager.find(query,(err,modules)=>{
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(modules)
                                }
                            },sort)
                            
                            console.log("查询数据库[find]${fnPrefix}");
                        }    
                    });
                });
            }
    
    };
        //导出全局变量一份 方便db中调用
        global.${fnPrefix}Cache=${fnPrefix}Cache;
        exports.${fnPrefix}Cache=${fnPrefix}Cache;
    `
    eval(fn);
    });