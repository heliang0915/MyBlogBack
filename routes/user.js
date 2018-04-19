var express = require("express")
var router = express.Router();
var roleManager = require("../db/roleManager");
var userManager = require("../db/userManager");
roleManager = new roleManager();
userManager = new userManager();

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

    userManager.page(currentPage, query, function (err, modules) {
        res.send(modules);
    })
})

router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    userManager.findByUUID(uuid, function (err, module) {
        roleManager.findAll(function(err,roles){
            module.roles=roles;
            res.send(module);
        })
    })
})
//获取用户信息
router.get('/getUserInfo/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    userManager.findByUUID(uuid, function (err, module) {
        var json={};
        json.name=module.name;
        json.pic=module.pic;
        json.uuid=module.uuid;
        json.nickName=module.nickName;
        json.roleId=module.roleId;
        json.loginType=module.loginType;
        res.send(json);
    })
})

router.post('/save', function (req, res) {
    var user = req.body;
    var uuid = user.uuid;
    if (uuid) {
        userManager.edit(uuid, user, function (err) {
            res.send(err == null ? "ok" : err);
        })
    } else {
        userManager.add(user, function (err) {
            res.send(err == null ? "ok" : err);
        })
    }
})

router.get('/delete/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    userManager.del(uuid, function (err) {
        res.send(err == null ? "ok" : err);
    })
})





module.exports = router;