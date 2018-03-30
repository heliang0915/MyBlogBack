/**
 * 角色管理类
 */
var baseDao = require('./base');
var util=require('util');
function roleManager(){
    baseDao.call(this,"roleModel")
}
util.inherits(roleManager,baseDao);
module.exports=roleManager;
