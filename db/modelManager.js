
let  baseDao = require('./base');
let util=require('util');
let modules=["menuModel","blogModel","channelModel","commentModel","rightModel","roleModel","userModel","zanModel"];
// var modelManager={};
modules.forEach(function (item,index){
    let fnPrefix= item.slice(0,item.indexOf('Model'));
    let fn=`function ${fnPrefix}Manager(){
            baseDao.call(this,item);
        };
        util.inherits(${fnPrefix}Manager,baseDao); 
        exports.${fnPrefix}Manager = ${fnPrefix}Manager;
        // modelManager['${fnPrefix}Manager']=${fnPrefix}Manager;
        // console.log(modelManager);
        `

    eval(fn);

    // if(index==modules.length-1){

        // console.log("代码执行了..."+JSON.stringify(fnMap));

         // console.log(Object.keys(modelManager));
    // }
});
    // console.log(fnMap['commentManager']);
    // console.log(fnMap['commentManager']);

    // let {commentManager}=modelManager;
    // console.log(new commentManager());
// console.log(modelManager);
// exports=modelManager;



// function menuManager(){
//     baseDao.call(this,"menuModel")
// }

