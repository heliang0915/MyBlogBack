/**
 * 服务端接口转发
 */
var  axios =require('axios');

var replaceReg=(str)=>{
    var reg = /\b(\w)|\s(\w)/g;
    str = str.toLowerCase();
    return str.replace(reg,function(m){return m.toUpperCase()})
}

var createHeader=(header)=>{
    var headers={};
    Object.keys(header).forEach((key)=>{
        headers[replaceReg(key)]=header[key];
    })
    return headers;
}


//转发请求
module.exports = function(url,req){
    console.log("url地址[%s]",url+"?temp="+Math.random())
    var params={}
    if(req.method=="POST"){
        params=req.body;
    }
    return new Promise((resolve,reject)=>{
        axios[req.method.toString().toLowerCase()](url,params)
            .then((data)=>{

            var info= {
                data,
                err:null
            }
            resolve(info);
        }).catch((err)=>{
            console.log("err-----"+err.message);
            var info= {
                data:null,
                err:err
            }
            reject(info);
        });
    })
}