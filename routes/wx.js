var express = require("express")
var router = express.Router();
var fetch=require("../util/fetch");
var moment=require("moment");
var wx=require("../config").wx;
var userManager = require("../db/userManager");
userManager = new userManager();
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

//用户是否注册过
router.get('/exist/:tid', function (req, res) {
    var tid=req.params.tid;

    console.log("tid:"+tid);

    userManager.find({tid:tid},function(err,models){
        if(models.length){
            res.send(true);
        }else{
            res.send(false);
        }
    })
});

//微信注册登录
router.post('/wxRegister', function (req, res) {
    var user = req.body;
    //user:{openId,}
    console.log(JSON.stringify(user));
    userManager.add(user, function (err) {
        res.send(err == null ? true : err);
    })
});

//更新登录时间等信息
router.get('/updateInfo/:tid', function (req, res) {
    var tid=req.params.tid;
    userManager.find({tid:tid},function(err,users){
        if(users.length){
            //更新用户信息
            var user=users[0];
            user.loginTime=moment().format("YYYY-MM-DD HH:mm:ss");
            userManager.edit(user.uuid,user, function (err) {
                res.send(err == null ? true : err);
            })
        }else{
            res.send(true);
        }
    })
});


module.exports = router;