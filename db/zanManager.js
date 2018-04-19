/**
 * 点赞管理类
 */
var baseDao = require('./base');
var util=require('util');
function zanManager(){
    baseDao.call(this,"zanModel")
}
util.inherits(zanManager,baseDao);
module.exports=zanManager;
