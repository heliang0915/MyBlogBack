
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

module.exports={
    getChannelPromise,
    getChannelALLPromise
}