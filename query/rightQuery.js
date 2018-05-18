/**
 *时间:2018/5/1
 *作者:heliang
 *功能:权限查询类 负责权限增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */
var  {rightCache,userCache}=require("../cache/modelCache");
/**
 * 根据用户ID获取该用户下有哪些权限
 * @param uuid 权限uuid
 * @returns {*}
 */
async  function getMenusByUserIdPromise(userId) {
     let userModel= await  userCache.findByUUID(userId);
     let {roleId}=userModel;
     let rightModels= await  rightCache.find({roleId});
     // console.log(rightModels)
     if(rightModels.length>0){
        return rightModels[0].menus;
     }else{
        return [];
     }
}
module.exports = {
    getMenusByUserIdPromise
}
