//配置数据库链接
var mongoose = require('mongoose');
//var util = require('util');
var uuid = require('node-uuid');
// var modelPath = "./";
//全局配置对象
var config = require('../config');
var cacheManager = require('../cache/cache');

//获取users的schema
// var modelName;
var ModelSchema = {};
var model = require('./schema');
function Base(modelName){
    this.modelName=modelName;
    ModelSchema[modelName] = mongoose.model(modelName);
    this.findByData =  function(data, callback){
        var self=this;
        callback = callback == undefined ? function () {
        } : callback;
        model[this.modelName].find(data, function (err, models) {
            if (err) {
                callback(err);
            } else {
                let modelList= self.parseModels(models);
                callback(null, modelList);
            }
        });
    }
    this.getDefaultModel=function(){
        var defaultModel={};
        var table=model[this.modelName].schema.obj;
        Object.keys(table).forEach(function (key){
            defaultModel[key]='';
        })
        return defaultModel;
    }
    //生成uuid
    this.getUUID=function (){
        var reg = /\-/g;
        var tempUUID = uuid.v4().replace(reg, function () {
            return "";
        });
        return tempUUID;
    }
    //格式化model
    this.parseModel=function (model){
        var item={};
        if(model){
            Object.keys(model._doc).forEach(function(key){
                if(key!="_id"&&key!="__v"){
                    item[key]=model._doc[key];
                }
            })
        }else{
            item=this.getDefaultModel()
        }
        return item;
    }
    //格式化model集合
    this.parseModels=function (models){
        var ary=[];
        var self=this;
        models.forEach(function(modle){
            var item=self.parseModel(modle);
            ary.push(item);
        })
        return ary;
    }

}
//返回最大的max
Base.prototype.getMaxOrder = function (callback) {
    callback = callback == undefined ? function () {
    } : callback;
    var query=model[this.modelName].find({});
    query.sort({order: -1})
    query.exec(function (err, doc) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            var order = 0;
            if (doc[0]) {
                order = doc[0].order;
                order=order==null?0:order;
            }
            console.log("order>>>"+order);
            callback(null, order);
        }
    })
}


//根据条件查询数量
Base.prototype.count = function (data, callback) {
    data = data == undefined ? {} : data;
    callback = callback == undefined ? function () {
    } : callback;
    model[this.modelName].count(data, function (err, len) {
        if (err) {
            callback(err);
        } else {
            callback(null, len);
        }
    })
}

/*新增*/
Base.prototype.add = function (modelData, callback) {
    /*获取uuid*/
    var tempUUID = this.getUUID();
    var newModelSchema = new ModelSchema[this.modelName]();
    var _this=this;
    this.getMaxOrder(function (err, order) {
        // console.log(order);
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
                _this.findByUUID(tempUUID,(err,module)=>{
                    callback(null,module);
                    console.log("插入成功");
                })
            }
        });
    })
}

/*修改*/
Base.prototype.edit = function (uuid, editObj, callback) {
    callback = callback == undefined ? function () {
    } : callback;
    this.findByUUIDByNoParse(uuid, function (err, model) {
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
Base.prototype.del = function (uuids, callback) {
    var self=this;
    callback = callback == undefined ? function () {
    } : callback;
    var uuidAry = [];
    if (uuids.indexOf(',') > -1) {
        uuidAry = uuids.split(",");
    } else {
        uuidAry.push(uuids);
    }
    uuidAry.forEach(function (uid) {
        self.findByUUIDByNoParse(uid, function (err, modelSchema) {
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
Base.prototype.findAll = function (callback) {
    this.findByData({}, callback);
}


Base.prototype.find = function (data, callback,sortFile) {
    var self=this;
    callback = callback == undefined ? function () {
    } : callback;

    var query=model[self.modelName].find(data);
    //是否关联查询
    var desc = {};
    desc["order"] = -1;
    if (sortFile) {
        desc = sortFile;
    }
    query.sort(desc);
    query.exec(function (err, models) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            callback(null, self.parseModels(models));
        }
    });
}

//分页
Base.prototype.page = function (currentPage, data, callback, sortFile,ps,populate) {
    var self=this;
    //查询总数
    this.count(data, function (err, total) {
        if (err) {
            callback(err);
            // errLogger.error(err);
        } else {
            var pageSize = ps||config.mongo.pageSize;
            var start = (parseFloat(currentPage) - 1) * pageSize;
            var desc = {};
            desc["order"] = -1;
            if (sortFile) {
                desc = sortFile;
            }
            var query=model[self.modelName].find(data);
            query.sort(desc);
            query.skip(start);
            query.limit(pageSize);

            query.exec(function (err, models) {
                // console.log("执行前...."+self.parseModels);
                var info={
                    total,
                    pageSize,
                    models:self.parseModels(models)
                }
                // console.log("page执行完毕...."+info);
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
/*根据uuid查询单条数据*/
Base.prototype.findByUUID = function (uuid, callback) {
    var self=this;
    callback = callback == undefined ? function () {
    } : callback;

    model[this.modelName].findOne({'uuid': uuid}, function (err, model) {
        if (!err) {
            callback(null, self.parseModel(model));
            console.log("根据uuid查询单条数据成功");
        } else {
            callback(err, null);
            console.log("查询出现错误：" + err);
        }
    });
}
/*根据uuid查询单条数据*/
Base.prototype.findByUUIDByNoParse = function (uuid, callback) {
    callback = callback == undefined ? function () {
    } : callback;

    model[this.modelName].findOne({'uuid': uuid}, function (err, model) {
        if (!err) {
            callback(null, model);
            console.log("根据uuid查询单条数据成功");
        } else {
            callback(err, null);
            console.log("查询出现错误：" + err);
        }
    });
}
module.exports=Base;