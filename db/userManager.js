/**
 * 用户管理类
 */
var baseDao = require('./base');
var util=require('util');
function userManager(){
    baseDao.call(this,"userModel")
}
util.inherits(userManager,baseDao);
module.exports=userManager;
