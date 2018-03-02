//配置数据库链接
var mongoose = require('mongoose');
//var util = require('util');
var uuid = require('node-uuid');
// var modelPath = "./";
//全局配置对象
var config = require('../config');

//获取users的schema
var modelName;
var ModelSchema = {};
var model = require('./schema');

exports.setModelName = function (modelNa) {
    modelName = modelNa;
    ModelSchema[modelName] = mongoose.model(modelName);
    // console.log("modelName>>>"+modelName);
    exports.modelName = modelName;
    exports.model = model;
}


/*生成uuid*/
function getUUID() {
    var reg = /\-/g;
    var tempUUID = uuid.v4().replace(reg, function () {
        return "";
    });
    return tempUUID;
}

//返回最大的max
var getMaxOrder = exports.getMaxOrder = function (callback) {
    callback = callback == undefined ? function () {
    } : callback;
    // console.dir(model);
    // console.log(modelName);
    var query=model[modelName].find({});
    query.sort({order: -1})
    query.exec(function (err, doc) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            var order = 0;
            if (doc[0]) {
                order = doc[0].order;
            }
            console.log("order>>>"+order);
            callback(null, order);
        }
    })
}

//根据条件查询数量
var count = exports.count = function (data, callback) {
    data = data == undefined ? {} : data;
    callback = callback == undefined ? function () {
    } : callback;
    model[modelName].count(data, function (err, len) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            callback(null, len);
        }
    })
}

/*新增*/
exports.add = function (modelData, callback) {
    /*获取uuid*/
    var tempUUID = getUUID();
    var newModelSchema = new ModelSchema[modelName]();
    getMaxOrder(function (err, order) {
        //console.log(order);
        for (var fileName in modelData) {
            newModelSchema[fileName] = modelData[fileName];
        }
        //自动插入uuid
        newModelSchema.order = parseInt(order) + 1;
        newModelSchema.uuid = tempUUID;
        newModelSchema.save(function (err) {
            if (err) {
                callback(err);
                console.log("新增出现错误：" + err);
                // errLogger.error(err);
            } else {
                callback(null);
                console.log("插入成功");
            }
        });
    })
}

/*修改*/
exports.edit = function (uuid, editObj, callback) {
    callback = callback == undefined ? function () {
    } : callback;
    findByUUIDByNoParse(uuid, function (err, model) {
        if (err) {
            callback(err);
            console.log("修改出现错误：" + err);
            // errLogger.error(err);
        } else {
            //循环
            for (var key in editObj) {
                if (editObj[key] != undefined) {
                    model[key] = editObj[key];
                }
            }
            model.save(function (err) {
                if (err) {
                    callback(err);
                    console.log("修改出现错误：" + err);
                    // errLogger.error(err);
                } else {
                    callback(null);
                    console.log("修改成功");
                }
            });
        }
    });
}

/*删除*/
exports.del = function (uuids, callback) {
    callback = callback == undefined ? function () {
    } : callback;
    var uuidAry = [];
    if (uuids.indexOf(',') > -1) {
        uuidAry = uuids.split(",");
    } else {
        uuidAry.push(uuids);
    }
    uuidAry.forEach(function (uid) {
        findByUUIDByNoParse(uid, function (err, modelSchema) {
            if (err) {
                callback(err);
                console.log("删除出现错误：" + err);
            } else {
                //删除
                console.log("modelSchema>"+modelSchema);
                modelSchema.remove();
                callback(null);
                console.log("删除成功");
            }
        })
    })
}

/*查询*/
exports.findAll = function (callback) {
    findByData({}, callback);
}


exports.find = function (data, callback) {
    callback = callback == undefined ? function () {
    } : callback;
    model[modelName].find(data, function (err, models) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            callback(null, parseModels(models));
        }
    });
}

//分页
exports.page = function (currentPage, data, callback, sortFile) {
    console.log("modelName>>>>>>"+modelName);
    //查询总数
    count(data, function (err, total) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            var pageSize = config.mongo.pageSize;
            var start = (parseFloat(currentPage) - 1) * pageSize;
            var desc = {};
            desc["order"] = -1;
            if (sortFile) {
                desc = sortFile;
            }
            var query=model[modelName].find(data);
            query.sort(desc);
            query.skip(start);
            query.limit(pageSize);
            query.exec(function (err, models) {

                var info={
                   total,
                   pageSize,
                   models:parseModels(models)
                }
                if (err) {
                    callback(err);
                    // errLogger.error(err);
                } else {
                    callback(null, info);
                }
            })

        }
    });
}

//根据条件查询数据
var findByData = function (data, callback) {
    callback = callback == undefined ? function () {
    } : callback;
    //console.log(  model[modelName].find);
    model[modelName].find(data, function (err, models) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            callback(null, parseModels(models));
        }
    });

}

//格式化model集合
function parseModels(models) {
    var ary=[];
    models.forEach(function(modle){

        var item=parseModel(modle);
        ary.push(item);
    })
    return ary;
}

//格式化model
function parseModel(model) {
    var item={};
    if(model){
        Object.keys(model._doc).forEach(function(key){
            if(key!="_id"&&key!="__v"){
                item[key]=model._doc[key];
            }
        })
    }else{
        item=getDefaultModel()
    }
    return item;
}

/*根据uuid查询单条数据*/
var findByUUID = exports.findByUUID = function (uuid, callback) {
    callback = callback == undefined ? function () {
    } : callback;

    model[modelName].findOne({'uuid': uuid}, function (err, model) {
        if (!err) {
            callback(null, parseModel(model));
            console.log("根据uuid查询单条数据成功");
        } else {
            callback(err, null);
            console.log("查询出现错误：" + err);
        }
    });
}

var findByUUIDByNoParse = exports.findByUUIDByNoParse = function (uuid, callback) {
    callback = callback == undefined ? function () {
    } : callback;

    model[modelName].findOne({'uuid': uuid}, function (err, model) {
        if (!err) {
            callback(null, model);
            console.log("根据uuid查询单条数据成功");
        } else {
            callback(err, null);
            console.log("查询出现错误：" + err);
        }
    });
}


var getDefaultModel=()=>{
    let defaultModel={};
    let table=model[modelName].schema.obj;
    Object.keys(table).forEach((key)=>{
        defaultModel[key]='';
    })
    return defaultModel;
}