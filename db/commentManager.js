/**
 * 评论管理类
 */
var baseDao = require('./base');
var util=require('util');
function commentModel(){
    baseDao.call(this,"commentModel")
}
util.inherits(commentModel,baseDao);
module.exports=commentModel;
