/**
 *时间:2018/5/1
 *作者:heliang
 *功能:文章查询类 负责文章增删改查的工作，其中查询已经使用cache缓存处理
 *    增 改 删 使用manager类处理
 */


var  {blogManager}=require("../db/modelManager");
var  {blogCache}=require("../cache/modelCache");
blogManager = new blogManager();

/**
 * 获取文章列表(分页)
 * @param currentPage 当前页
 * @param query 查询条件
 * @param sort 排序条件
 * @param ps  pageSize 页容量
 * @returns {*}
 */
function articleListPromise(currentPage, query,sort,ps) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return blogCache.page(currentPage, query,sort,ps);
}

/**
 *获取所有文章列表(不分页)
 * @param query 查询条件
 * @param sort 排序条件
 * @returns {*}
 */
function articleListAllPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return blogCache.find(query,sort);
}

/**
 * 保存文章信息
 * @param uuid 文章uuid
 * @param model 保存的文章模型
 * @returns {Promise<any>} promise 对象
 */
function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            blogManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)

                }
            })

        } else {
            blogManager.add(model, function (err) {
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
 * 根据UUID获取文章信息
 * @param uuid 文章uuid
 * @returns {*}
 */
function getArticleByUUIDPromise(uuid) {
    return blogCache.findByUUID(uuid);
}
/**
 *  删除文章
 * @param uuid 文章uuid
 * @returns {Promise<any>}
 */
function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        blogManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}

/**
 * 添加 pv 数量
 * @param uuid 文章uuid
 * @returns {Promise<any>} 返回一个promise模型
 */
function addPVPromise (uuid){
    return new Promise((resolve, reject)=>{
        this.getArticleByUUIDPromise(uuid).then((blog)=>{
             let pv=blog.pv==null?0:blog.pv;
             blog.pv=parseInt(pv)+1;
             this.savePromise(uuid, blog).then(()=>{
                 resolve();
             }).catch(()=>{
                 reject(err)
             })
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = {
    articleListPromise,
    articleListAllPromise,
    getArticleByUUIDPromise,
    savePromise,
    deletePromise,
    addPVPromise
}
