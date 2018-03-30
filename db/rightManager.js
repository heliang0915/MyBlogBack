/**
 * 权限管理类
 */
var baseDao = require('./base');
var util=require('util');
function rightManager(){
    baseDao.call(this,"rightModel")
}
util.inherits(rightManager,baseDao);
module.exports=rightManager;
