let express = require("express")
let router = express.Router();
let fetch = require("../util/fetch");
let config = require("../config");
let moment = require("moment");
let cheerio = require("cheerio");
let wx = config.wx;
let {userManager} = require("../db/modelManager");
let articleQuery = require("../query/articleQuery");
let channelQuery = require("../query/channelQuery");
let {blogCache} = require("../cache/modelCache");
let zanQuery = require("../query/zanQuery");
let commentQuery = require("../query/commentQuery");
let tokenUtil=require("../security/token");
let util=require("../util/util");
let {getBlogList,getSingle}=require("./common");
// let queryParse=require("../cache/util/queryParse")
let  appId = wx.appId;
let secret = wx.secret;
userManager = new userManager();
//登录
router.get('/login/:code', function (req, res) {
    var code = req.params.code;
    fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`, req).then(function (resp, err) {
        // res.send(resp);
        var data = resp.data.data;

        res.send(data);
    });
})

//用户是否注册过
router.get('/exist/:tid', function (req, res) {
    var tid = req.params.tid;
    console.log("tid:" + tid);
    userManager.find({tid: tid}, function (err, models) {
        if (models.length) {
            //创建token
            let tokenStr=tokenUtil.createUserToken(models[0].uuid);
            res.send(tokenStr);
        } else {
            res.send(false);
        }
    })
});


//微信注册登录
router.post('/wxRegister', function (req, res) {
    var user = req.body;
    userManager.add(user, function (err,module) {
        //创建token
        let tokenStr=tokenUtil.createUserToken(module.uuid);
        // res.send(tokenStr);
        res.send(err == null ? tokenStr: err);
    })
});


//更新登录时间等信息
router.get('/updateInfo/:tid', function (req, res) {
    var tid = req.params.tid;
    userManager.find({tid: tid}, function (err, users) {
        if (users.length) {
            //更新用户信息
            var user = users[0];
            user.loginTime = moment().format("YYYY-MM-DD HH:mm:ss");
            userManager.edit(user.uuid, user, function (err) {
                res.send(err == null ? true : err);
            })
        } else {
            res.send(true);
        }
    })
});

//wx 获取文章列表
router.post('/blogList', function (req, res) {
    var currentPage = req.body.page;
    var params = req.body.params;
    currentPage = (currentPage == null || currentPage <= 0) ? 1 : currentPage;
    var pageSize=req.body.pageSize||10;
    getBlogList(params,currentPage,pageSize).then((info)=>{
        res.send(info);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    })
});

//wx 获取单个文章
router.get('/blogSingle/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    // async function getSingle(uuid) {
    //     let blog = await articleQuery.getArticleByUUIDPromise(uuid);
    //     let channel = await channelQuery.getChannelByUUIDPromise(blog.tag);
    //     //增加pv
    //     let pv = blog.pv == null ? 0 : blog.pv;
    //     blog.pv = parseInt(pv) + 1;
    //     await articleQuery.savePromise(uuid, blog);
    //     blog["channelName"] = channel.name;
    //     var json = {
    //         module: blog
    //     }
    //     return json;
    // }
    getSingle(uuid).then((json) => {
        res.send(json);
    })
})
//获取赞状态
router.post('/getZan',function (req,res) {
    var {blogId} = req.body;
    let userId=util.userUtil.getUserId(req);
    console.log("userId::::::::::::::::::::::"+userId);
    if(userId){
        zanQuery.isZanPromise(userId,blogId).then((isZan)=>{
            res.send(isZan)
        }).catch((err)=>{
            res.send(err)
        })
    }else{
        res.send(false);
    }
})
//点赞动作
router.post('/blogZan', function (req, res) {
    var {blogId,isZan} = req.body;
    let userId=util.userUtil.getUserId(req);
    console.log("userId################"+userId);
    if(userId){
        zanQuery.changeZanPromise(userId,blogId,isZan).then(()=>{
            res.send('ok')
        }).catch((err)=>{
            res.send(err)
        })
    }else{
        res.send('false')
    }
});

router.post('/checkLogin',function (req, res) {
     let isLogin=util.userUtil.checkLogin(req);
     res.send(isLogin);
})

//我的列表
router.post('/myList',function (req, res) {
    let userId=util.userUtil.getUserId(req);
    var currentPage = req.body.page;
    var type = req.body.listType;
    currentPage = (currentPage == null || currentPage <= 0) ? 1 : currentPage;
     if(type==1){
         //获取我的点赞文章列表
         zanQuery.getArticleByUserId(userId,currentPage).then((info)=>{
             console.log("info::::::::"+JSON.stringify(info));
             res.send(info)
         }).catch((err)=>{
             res.send(err)
         })
     }else {
         //获取我的评论文章列表
         commentQuery.getBlogListByUserId(userId,currentPage).then((info)=>{
             console.log("获取我的评论文章列表...........");
             res.send(info)
         }).catch((err)=>{
             console.log("获取我的评论文章列表 出错...");
             res.send(err)
         })
     }
})

module.exports = router;