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
    // var apiURl=conf.api;
    // if(url.indexOf("/api/")>-1){
    //     var urlReg=/(\/\w+)/;
    //     var  query="";
    //     var pathName="";
    //     var queryStr="";
    //     if(url.indexOf('?')==-1){
    //         url=url.replace(urlReg,'');
    //         url=apiURl+url;
    //     }else{
    //         query=url.split('?');
    //         pathName=query[0];
    //         queryStr=query[1]==undefined?"":query[1];
    //         pathName=pathName.replace(urlReg,'');
    //         url=apiURl+pathName+"?"+queryStr;
    //     }
    // }
    console.log("url地址[%s]",url+"?temp="+Math.random())
    console.log("Method [%s]",req)
    var params={}
    if(req.method=="POST"){
        params=req.body;
    }
    return new Promise((resolve,reject)=>{
        axios[req.method.toString().toLowerCase()](url,params)
        // axios({
        //     method: req.method.toString().toLowerCase(),
        //     url: url+"?temp="+Math.random(),
        //     params,
        // })
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