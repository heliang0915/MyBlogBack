
var  channelManager=require("../db/channelManager");
channelManager=new channelManager();


function getChannelPromise(uuid){
    return new Promise((resolve, reject)=>{
        //查询频道信息
        channelManager.findByUUID(uuid,function (err,channel){
            if(err){
                reject(err)
            }else{
                resolve(channel)
            }
        })
    })
}

function getChannelALLPromise(){
    return new Promise((resolve, reject)=>{
        //查询频道信息
        channelManager.findAll(function (err,channels){
            if(err){
                reject(err)
            }else{
                resolve(channels)
            }
        })
    })
}

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


function pagePromise(currentPage,query,sort,pageSize){
    return new Promise((resolve, reject)=>{
        channelManager.page(currentPage, query, function(err,modules){
            if (err) {
                reject(err)
            } else {
                resolve(modules)
            }
        },sort,pageSize)
    })
}

module.exports={
    getChannelPromise,
    getChannelALLPromise,
    savePromise,
    deletePromise,
    pagePromise
}