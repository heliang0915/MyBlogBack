/**
 * 栏目管理类
 */
var baseDao = require('./base');
var util=require('util');
function channelManager(){
    baseDao.call(this,"channelModel")
}
util.inherits(channelManager,baseDao);
module.exports=channelManager;