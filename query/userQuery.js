/**
 *时间:2018/5/1
 *作者:heliang
 *功能:用户查询类 负责用户增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */


var  {userManager}=require("../db/modelManager");
var  {userCache}=require("../cache/modelCache");
userManager = new userManager();

/**
 * 获取用户列表(分页)
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param ps  pageSize 页容量
 * @returns {*}
 */
function userListPromise(currentPage, query,sort,ps) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return userCache.page(currentPage, query,sort,ps);
}

/**
 *获取所有用户列表(不分页)
 * @param query 查询条件
 * @param sort 排序条件
 * @returns {*}
 */
function userListAllPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return userCache.find(query,sort);
}

/**
 * 保存用户信息
 * @param uuid 用户uuid
 * @param model 保存的用户模型
 * @returns {Promise<any>} promise 对象
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            userManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)

                }
            })

        } else {
            userManager.add(model, function (err) {
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
 * 根据UUID获取用户信息
 * @param uuid 用户uuid
 * @returns {*}
 */
function getUserByUUIDPromise(uuid) {
    return userCache.findByUUID(uuid);
}
/**
 *  删除用户
 * @param uuid 用户uuid
 * @returns {Promise<any>}
 */
function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        userManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}

module.exports = {
    userListPromise,
    userListAllPromise,
    getUserByUUIDPromise,
    savePromise,
    deletePromise
}
