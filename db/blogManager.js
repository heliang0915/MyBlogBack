/**
 * 博客管理类
 */
var baseDao = require('./base');
var util=require('util');
function blogManager(){
    baseDao.call(this,"blogModel")
}
util.inherits(blogManager,baseDao);
module.exports=blogManager;
