var  {blogManager}=require("../db/modelManager");
var  {blogCache}=require("../cache/modelCache");
blogManager = new blogManager();

//获取文章列表
function articleListPromise(currentPage, query,sort,ps) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return blogCache.page(currentPage, query,sort,ps);
}

//获取文章列表
function articleListAllPromise(query,sort) {
    let defaultSort={
        order:-1
    }
    sort=sort==null?defaultSort:sort;
    return blogCache.find(query,sort);
}


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

//根据UUID获取文章信息
function findByUUIDPromise(uuid) {
    return blogCache.findByUUID(uuid);
}

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

//添加 pv 数量
function addPVPromise (uuid){
    return new Promise((resolve, reject)=>{
        this.findByUUIDPromise(uuid).then((blog)=>{
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
    findByUUIDPromise,
    savePromise,
    deletePromise,
    addPVPromise
}
