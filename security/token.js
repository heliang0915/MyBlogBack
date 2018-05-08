/*添加安全token*/
var crypto=require("crypto");
var secret="blogapi.top";
var token={
    createToken:function(obj,timeout){
        var obj2={
            data:obj,//payload
            created:parseInt(Date.now()/1000),//token生成的时间的，单位秒
            exp:parseInt(timeout)||10//token有效期
        };
        //payload信息
        var base64Str=Buffer.from(JSON.stringify(obj2),"utf8").toString("base64");

        //添加签名，防篡改
        var hash=crypto.createHmac('sha256',secret);
        hash.update(base64Str);
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
        //将payload json字符串 解析为对象
        try{
            payload=JSON.parse(Buffer.from(decArr[0],"base64").toString("utf8"));
        }catch(e){
            return false;
        }
        //检验签名
        var hash=crypto.createHmac('sha256',secret);
        hash.update(decArr[0]);
        var checkSignature=hash.digest('base64');

        return {
            payload:payload,
            signature:decArr[1],
            checkSignature:checkSignature
        }
    },

    createUserToken:function(userId){
        let userInfo=typeof userId=="string"?{userId}:userId;

        let tokenStr=this.createToken(userInfo,Date.now()/1000+24*3600);
        console.log("生成token成功");
        return tokenStr;

    },
    checkToken:function(token){
        var resDecode=this.decodeToken(token);
        if(!resDecode){

            return false;
        }
        //是否过期 返回true 表示不过期 返回false表示过期
        var expState=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created))>parseInt(resDecode.payload.exp)?false:true;
        if(resDecode.signature===resDecode.checkSignature&&expState){
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
// let tokenStr=token.createToken({
//    userId:'123'
// },timeout);
// let obj=token.decodeToken(tokenStr);
// let isPass=token.checkToken(tokenStr);
// console.log(obj.payload.data.userId)
// console.log(isPass)
module.exports=exports=token;