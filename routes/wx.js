var express = require("express")
var router = express.Router();
var fetch=require("../util/fetch");
var wx=require("../config").wx;
var appId=wx.appId;
var secret=wx.secret;
router.get('/login/:code', function (req, res) {
    var code=req.params.code;
    console.log(`-----------${code}`);
    fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,req).then(function(resp,err){
        // res.send(resp);
        var data=resp.data.data;
        var openid=data.openid;
        var session_key=data.session_key;
        console.log(openid);
        res.send(data);
    });
})
module.exports = router;