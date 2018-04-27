
var  {zanManager}=require("../db/modelManager");
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
                // console.log(`zanModules>>>>>>>>>>>>>${JSON.stringify(zanModules)}`);
                resolve(zanModules.length)
            }
        })
    })
}

//点击赞或取消赞
async function changeZanPromise(userId,blogId,isZan){
    //1.根据userId和blogId查询是否有点赞记录
    let modules=await getZanByUserIdAndBlogId(userId,blogId);
    // console.log("modules>>"+modules);
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

module.exports={
    savePromise,
    isZanPromise,
    getZanCountByBlogId,
    changeZanPromise
}