var express = require('express');
var router = express.Router();
var tokenUtil=require("../security/token");
let userQuery=require("../query/userQuery");
let channelQuery=require("../query/channelQuery");
var process = require('child_process');
router.all('*', function(req, res, next) {
    res.type('html');
    next();
});

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/cavas', function(req, res, next) {
    res.render('cavas');
});

router.all('/getTree',(req,res)=>{
    channelQuery.getChannelAllTree('0').then((tree)=>{
        res.send(JSON.stringify(tree));
    })
})

router.get('/reload',function (req,res) {
    reload();
    res.render('reload');
})

//校验token是否合法
router.post('/checkToken',function (req,res) {
    let {token}=req.body;
    token=decodeURIComponent(token);
    // console.log(token)
    if(token){
        let validate=tokenUtil.checkToken(token);
        res.send(validate);
    }else{
        res.send(false);
    }
})
//登录动作
router.post('/login',function (req,res) {
    let {name,pwd}=req.body;
    //查询用户是否存在
    userQuery.userListAllPromise({
        name,
        pwd
    }).then((modules)=>{
        if(modules.length){
            let userInfo=modules[0];
            delete userInfo['pwd'];
            //生成token
            // console.log("createUserToken>>>>"+JSON.stringify(userInfo));
            let tokenStr=tokenUtil.createUserToken(userInfo);
            res.send(tokenStr)
        }else{
            res.send(false)
        }
    }).catch((err)=>{
        console.log(err);
        res.send(false)
    })
})

function  reload(callback) {
    let reloadSh="sh reload.sh";
    console.log("执行reload脚本开始.....");
    process.exec(`${reloadSh}`,function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }else{
            console.log(`命令:${reloadSh} 执行成功`);
        }
    })
}
module.exports = router;
