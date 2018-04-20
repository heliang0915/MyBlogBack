var articleManager = require("../db/blogManager");
articleManager = new articleManager();

//获取文章列表
function articleListPromise(currentPage, query) {
    return new Promise((resolve, reject) => {
        articleManager.page(currentPage, query, function (err, info) {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        });
    })
}

function savePromise(uuid, model) {
    return new Promise((resolve, reject) => {
        if (uuid) {
            articleManager.edit(uuid, model, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            })

        } else {
            articleManager.add(model, function (err) {
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
    return new Promise((resolve, reject) => {
        articleManager.findByUUID(uuid, function (err, module) {
            if (err) {
                reject(err)
            } else {
                resolve(module)
            }
        });
    })
}

function deletePromise(uuid){
    return new Promise(((resolve, reject) => {
        articleManager.del(uuid,function (err){
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    }))
}


module.exports = {
    articleListPromise,
    findByUUIDPromise,
    savePromise,
    deletePromise
}
