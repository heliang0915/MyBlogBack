/**
 * 博客管理类
 */
var baseDao = require('./base');
baseDao.setModelName("blogModel");
exports=module.exports=baseDao;
//继承基类 扩展方法