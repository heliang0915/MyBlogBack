/**
 *时间:2018/5/1
 *作者:heliang
 *功能:频道查询 负责频道增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */
var  {channelManager}=require("../db/modelManager");
var  {channelCache}=require("../cache/modelCache");
channelManager=new channelManager();

/**
 * 根据频道UUID获取频道信息
 * @param uuid 频道UUID
 * @returns {Promise<any>} 返回Promise对象
 */
function getChannelByUUIDPromise(uuid){


    return channelCache.findByUUID(uuid);

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
 * 查询所有频道信息
 * @returns {*}
 */
function getChannelALLPromise(){


    return channelCache.find({})


    // return new Promise((resolve, reject)=>{
    //     //查询频道信息
    //     channelManager.findAll(function (err,channels){
    //         if(err){
    //             reject(err)
    //         }else{
    //             resolve(channels)
    //         }
    //     })
    // })


}

/**
 * 保存频道信息
 * @param uuid 频道UUD
 * @param model 频道模型
 * @returns {Promise<any>} 返回Promise对象
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            channelManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })

        } else {
            channelManager.add(model, function (err) {
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
 * 删除频道信息
 * @param uuid 频道UUID
 * @returns {Promise<any>} 返回Promise
 */
function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        channelManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}

/**
 * 频道分页信息
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param pageSize  页容量
 * @returns {Promise<any>}
 */

function pagePromise(currentPage,query,sort,pageSize){
    return channelCache.page(currentPage, query,sort,pageSize);

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




module.exports={
    getChannelByUUIDPromise,
    getChannelALLPromise,
    savePromise,
    deletePromise,
    pagePromise
}