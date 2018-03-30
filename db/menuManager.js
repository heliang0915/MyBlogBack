/**
 * 菜单管理类
 */
var baseDao = require('./base');
var util=require('util');
function menuManager(){
    baseDao.call(this,"menuModel")
}
util.inherits(menuManager,baseDao);
module.exports=menuManager;
