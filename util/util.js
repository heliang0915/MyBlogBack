let tokenUtil=require("../security/token");
let util={
    stringUtil:{
        substr(str,n){
            var r=/[^\x00-\xff]/g;
            if(str.replace(r,"mm").length<=n){return str;}
            var m=Math.floor(n/2);
            for(var i=m;i<str.length;i++){
                if(str.substr(0,i).replace(r,"mm").length>=n){
                    return str.substr(0,i)+"...";
                }
            }
            return str;
        }
    },
    userUtil:{
        //从token中直接解析userId 存入的时候也是只存了userId
        getUserId(req){
            var {token} = req.body;
            let userId=tokenUtil.getByKey(token,"userId");
            console.log("token中解析的userId为:"+userId);
            return userId;
        },
        //从token中解析用户对象 并取出userId
        getUserIdByToken(token){
            let userId=tokenUtil.getByKey(token,"uuid");
            console.log("token中解析的userId为:"+userId);
            return userId;
        }
    }

}
module.exports=util;

