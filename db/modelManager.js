let  baseDao = require('./base');
let util=require('util');
let modules=["menuModel","blogModel","channelModel","commentModel","rightModel","roleModel","userModel","zanModel"];
modules.forEach(function (item,index){
    let fnPrefix= item.slice(0,item.indexOf('Model'));
    let fn=`function ${fnPrefix}Manager(){
            baseDao.call(this,item);
        };
        util.inherits(${fnPrefix}Manager,baseDao); 
        exports.${fnPrefix}Manager = ${fnPrefix}Manager;
        `
    eval(fn);
});

