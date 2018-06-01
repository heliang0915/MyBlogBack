/*添加安全token*/
var crypto=require("crypto");
var secret="blogapi.top";
var token={
    createToken:function(obj,timeout){
        var obj2={
            data:obj,//payload
            created:parseInt(Date.now()/1000),//token生成的时间的，单位秒
            exp:parseInt(timeout)||10//token有效期a
        };

        //payload信息
        console.log("obj"+JSON.stringify(obj));
        console.log("obj2"+JSON.stringify(obj2));
        var base64Str=Buffer.from(JSON.stringify(obj2),"utf8").toString("base64");



        //添加签名，防篡改
        var hash=crypto.createHmac('sha256',secret);
        hash.update(base64Str);
        // console.log("base64Str>>>"+base64Str);
        var signature=hash.digest('base64');
        return  base64Str+"."+signature;
    },
    decodeToken:function(token){
        var decArr=token.split(".");
        if(decArr.length<2){
            //token不合法
            return false;
        }

        var payload={};
        var info=decArr[0];
        var signature=decArr[1];
        //将payload json字符串 解析为对象
        try{
            payload=JSON.parse(Buffer.from(info,"base64").toString("utf8"));
        }catch(e){
            console.log(e);
            return false;
        }
        //检验签名
        var hash=crypto.createHmac('sha256',secret);
        hash.update(decArr[0]);
        var checkSignature=hash.digest('base64');

        return {
            payload:payload,
            signature:signature,
            checkSignature:checkSignature
        }
    },

    createUserToken:function(obj){
        let userInfo=typeof obj=="string"?{userId:obj}:obj;
        //设置token存活时间为1小时
        let tokenStr=this.createToken(userInfo,3600);
        return tokenStr;
    },
    checkToken:function(token){
        var resDecode=this.decodeToken(token);
        if(!resDecode){
            return false;
        }
        //是否过期 返回true 表示不过期 返回false表示过期
        var expState=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created))>parseInt(resDecode.payload.exp)?false:true;
       // console.log("token存活时间..."+resDecode.payload.exp);
        let cha=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created));
        if(resDecode.signature===resDecode.checkSignature&&expState){
            console.log(`token有效 存活时长:【${resDecode.payload.exp}】秒 在【${resDecode.payload.exp-cha}】秒后时效...`);
            return true;
        }
        return false;
    },
    getByKey:function (token,key) {
        let isCheck=this.checkToken(token);
        if(isCheck){
            let obj=this.decodeToken(token);
            let val=obj.payload.data[key];
            return val;
        }else{
            return "";
        }
    }
}



// let timeout=parseInt(Date.now()/1000)+parseInt(24*3600);
// let tokenStr=token.createToken({"name":"zhangsan","phone":"12333333333","pic":"http://www.blogapi.top:4869/95c1b9a02e102b5a0556fea58aa520b4?w=300&q=100","loginType":"0","order":2,"uuid":"8fe5f48e59f34679aff191165ce06f53","roleId":"40d13e63ab3744ef9c1b96f874fd8256"}
//     ,timeout);
// console.log(tokenStr)
// let obj=token.decodeToken(tokenStr);
// let isPass=token.checkToken(tokenStr);
// console.log(obj.payload.data.userId)
// console.log(isPass)
module.exports=exports=token;