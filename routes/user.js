var express = require("express");

var router = express.Router();
var {roleManager,userManager,zanManager} = require("../db/modelManager");
let userQuery=require("../query/userQuery");
let roleQuery=require("../query/roleQuery");
let util=require("../util/util");

roleManager = new roleManager();
userManager = new userManager();
zanManager = new zanManager();
// var AppConst = require("../const/APPConst");

router.post('/list', function (req, res) {
    var currentPage = req.body.page;
    var sort = req.body.sort;
    var params = req.body.params;
    var pageSize = req.body.pageSize;
    var query = {};
    currentPage = (currentPage == null || currentPage <= 0) ? 1 : currentPage;

    if (params && params.name) {
        query['name'] = new RegExp(params.name);
    }
    if (params && params.tag) {
        query['tag'] = params.tag;
    }


    userQuery.userListPromise(currentPage, query,sort).then((modules)=>{
        res.send(modules);
    }).catch((err)=>{
        res.send(err);
    })

    // userManager.page(currentPage, query, function (err, modules) {
    //     res.send(modules);
    // })
})

router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    getSingleUser(uuid).then((user)=>{
        res.send(user);
    }).catch((err)=>{
        res.send(err);
    })
    async function getSingleUser(uuid) {
        let user=await userQuery.getUserByUUIDPromise(uuid);
        user=user==null?{}:user
        console.log("user>>>"+user);
        let roles= await roleQuery.roleListAllPromise({});
        user.roles=roles;
        console.log("getSingleUser>>>"+user);
        return user;
    }
})
//获取用户信息
router.get('/getUserInfo/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    userQuery.getUserByUUIDPromise(uuid).then((module)=>{
        var json={};
        json.name=module.name;
        json.pic=module.pic;
        json.uuid=module.uuid;
        json.nickName=module.nickName;
        json.roleId=module.roleId;
        json.loginType=module.loginType;
        res.send(json);
    }).catch((err)=>{
        res.send(err);
    })
    // userManager.findByUUID(uuid, function (err, module) {
    //     var json={};
    //     json.name=module.name;
    //     json.pic=module.pic;
    //     json.uuid=module.uuid;
    //     json.nickName=module.nickName;
    //     json.roleId=module.roleId;
    //     json.loginType=module.loginType;
    //     res.send(json);
    // })
})

router.post('/save', function (req, res) {
    var user = req.body;
    var uuid = user.uuid;
    userQuery.savePromise(uuid,user).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
    // if (uuid) {
    //     userManager.edit(uuid, user, function (err) {
    //         res.send(err == null ? "ok" : err);
    //     })
    // } else {
    //     userManager.add(user, function (err) {
    //         res.send(err == null ? "ok" : err);
    //     })
    // }
})

router.get('/delete/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;

    userQuery.deletePromise(uuid).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })

    // userManager.del(uuid, function (err) {
    //     res.send(err == null ? "ok" : err);
    // })
})


//用户点赞(取消) 1:点赞 0：取消
// router.post('/zan',function (req,res) {
//     //1).如果存在则根据 type类型 设置是否点赞动作 如果type=1则进行如下操作
//     //2).从用户session中取出当前用户信息查询是否该用户在点赞表中
//     //3).创建点赞记录 并设置type值
//     // zanManager.find
//
//
//     var {blogId,type} = req.body;
//     let userId=util.userUtil.getUserId(req);
//
//     // let  {type,blogId}=req.params;
//     if(type){ //用户进行点赞
//         //从用户session中取出当前用户信息查询是否该用户在点赞表中
//         // var userId="29cc47047bb9497487ce2de4adae502a";
//         zanManager().find({
//             userId,
//             blogId
//         },(err,zans)=>{
//             if(zans.length>0){
//                 let model=zans[0];
//                 //当前记录存在更新值信息
//                 zanManager.edit(model.uuid, model, function (err) {
//                     res.send(err == null ? "ok" : err);
//                 })
//             }else{
//                 let model={
//                     userId,
//                     blogId,
//                     isZan:type==1,
//                 }
//                 zanManager.add(model.uuid, model, function (err) {
//                     res.send(err == null ? "ok" : err);
//                 })
//             }
//         })
//     }
// })

module.exports = router;