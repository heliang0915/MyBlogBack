/**
 *时间:2018/5/1
 *作者:heliang
 *功能:角色查询类 负责角色增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */


var  {roleManager}=require("../db/modelManager");
var  {roleCache}=require("../cache/modelCache");
roleManager = new roleManager();

/**
 * 获取角色列表(分页)
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param ps  pageSize 页容量
 * @returns {*}
 */
function roleListPromise(currentPage, query,sort,ps) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return roleCache.page(currentPage, query,sort,ps);
}

/**
 *获取所有角色列表(不分页)
 * @param query 查询条件
 * @param sort 排序条件
 * @returns {*}
 */
function roleListAllPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return roleCache.find(query,sort);
}

/**
 * 保存角色信息
 * @param uuid 角色uuid
 * @param model 保存的角色模型
 * @returns {Promise<any>} promise 对象
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            roleManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)

                }
            })

        } else {
            roleManager.add(model, function (err) {
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
 * 根据UUID获取角色信息
 * @param uuid 角色uuid
 * @returns {*}
 */
function getRoleByUUIDPromise(uuid) {
    return roleCache.findByUUID(uuid);
}
/**
 *  删除角色
 * @param uuid 角色uuid
 * @returns {Promise<any>}
 */
function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        roleManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}



module.exports = {
    roleListPromise,
    roleListAllPromise,
    getRoleByUUIDPromise,
    savePromise,
    deletePromise
}
