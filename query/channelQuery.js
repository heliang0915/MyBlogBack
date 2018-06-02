/**
 *时间:2018/5/1
 *作者:heliang
 *功能:频道查询 负责频道增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */
var  {channelManager}=require("../db/modelManager");
var  {channelCache}=require("../cache/modelCache");
channelManager=new channelManager();

const ROOTChannel="顶级栏目";

/**
 * 根据频道UUID获取频道信息
 * @param uuid 频道UUID
 * @returns {Promise<any>} 返回Promise对象
 */
function getChannelByUUIDPromise(uuid){
    return channelCache.findByUUID(uuid);
}

/**
 * 查询所有频道信息
 * @returns {*}
 */
function getChannelALLPromise(){
    return channelCache.find({})
}

/**
 * 查询子频道
 * @returns {*}
 */
async function getChildrenByPidStr(uuid){
   let childrenChannels= await getChannelByPid(uuid);
   let children=[];
   childrenChannels.forEach((item)=>{
       let child={}
       child.label=item.name;
       child.value=item.uuid;
       child.rank=item.rank;
       children.push(child);
    })
    return children;
}

/**
 * 获取频道树
 * @returns
 */
async function getChannelAllTree(uuid){
    let tree={
        label:"顶级栏目",
        value:'-1',
        rank:0
    }
     async  function getChildren(node){
         let currentChannel=await getChannelByUUIDPromise(uuid);
         let children=await getChildrenByPidStr(node.value);

         if(currentChannel){
             if(children.length){
                 let rank=node.rank;
                 let crurrentNodeRank=currentChannel.rank;
                 if(crurrentNodeRank-1>rank){
                     node.children = children;
                 }

                 for(let childNode of children){
                     if(currentChannel.uuid!=childNode.uuid){
                         await  getChildren(childNode);
                     }
                 }
             }

         }else{
             node.children = children;
             for(let childNode of children){
                await  getChildren(childNode);
             }
         }

         // if(children.length){
         //     let rank=node.rank;
         //     let crurrentNodeRank=currentChannel.rank;
         //
         //
         //     if(uuid&&crurrentNodeRank-1>rank) {
         //         node.children = children;
         //     }
         //
         //
         //     for(let childNode of children){
         //         if(currentChannel.uuid!=childNode.uuid){
         //             await  getChildren(childNode);
         //         }
         //     }
         // }else{
         //
         //
         //
         // }
     }
    await  getChildren(tree);

    let ary=[];
    ary.push(tree);
    return ary ;
}

/**
 * 获取频道树
 * @returns
 */
async function getChannelByPid(pid){
    let channels=await channelCache.find({pid});
    return channels;
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
    return new Promise((resolve, reject) => {
        channelCache.page(currentPage, query, sort, pageSize).then(async (info) => {
            for(let model of info.models){
                let {pid}=model;
                let channel=null;
                if(pid==-1){
                    channel={name:ROOTChannel}
                }else{
                    channel= await getChannelByUUIDPromise(pid);
                }
                console.log("channel:::::"+JSON.stringify(channel));
                let {name}=channel;
                model.pName=name;
            }
            resolve(info);
        }).catch(()=>{
            reject();
        })
    })
}

module.exports={
    getChannelByUUIDPromise,
    getChannelALLPromise,
    getChannelAllTree,
    savePromise,
    deletePromise,
    pagePromise
}