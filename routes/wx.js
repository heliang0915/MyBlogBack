var express = require("express")
var router = express.Router();
var fetch=require("../util/fetch");
var {appId,secret}=require("../config").wx;


router.get('/login/:code', function (req, res) {
    var code=req.params.code;
    console.log(`-----------${code}`);
    // code="061T3qXp0Z6Rno1rpCXp0YSsXp0T3qXT";
    // var appId="wx4abeef7a084d03d6";
    // var secret="c6b6640c61f02815312c810f79507778";
    fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,req).then(function(resp,err){
        // res.send(resp);
        var {session_key,openid}=resp.data.data;
        // console.log(resp);
        // console.log(err);
        //
        // console.log(err);
        console.log(openid);

        res.send(resp.data.data);
    });
})


module.exports = router;