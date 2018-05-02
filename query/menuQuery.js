/**
 *时间:2018/5/1
 *作者:heliang
 *功能:菜单查询类 负责菜单增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */


var  {menuManager}=require("../db/modelManager");
var  {menuCache}=require("../cache/modelCache");
menuManager = new menuManager();

/**
 * 获取菜单列表(分页)
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param ps  pageSize 页容量
 * @returns {*}
 */
function menuListPromise(currentPage, query,sort,ps) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return menuCache.page(currentPage, query,sort,ps);
}

/**
 *获取所有菜单列表(不分页)
 * @param query 查询条件
 * @param sort 排序条件
 * @returns {*}
 */
function menuListAllPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return menuCache.find(query,sort);
}

/**
 * 保存菜单信息
 * @param uuid 菜单uuid
 * @param model 保存的菜单模型
 * @returns {Promise<any>} promise 对象
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            menuManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)

                }
            })

        } else {
            menuManager.add(model, function (err) {
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
 * 根据UUID获取菜单信息
 * @param uuid 菜单uuid
 * @returns {*}
 */
function getMenuByUUIDPromise(uuid) {
    return menuCache.findByUUID(uuid);
}
/**
 *  删除菜单
 * @param uuid 菜单uuid
 * @returns {Promise<any>}
 */
function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        menuManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}



module.exports = {
    menuListPromise,
    menuListAllPromise,
    getMenuByUUIDPromise,
    savePromise,
    deletePromise
}
