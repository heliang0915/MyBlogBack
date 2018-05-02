var express = require("express")
var router = express.Router();
var {menuManager} = require("../db/modelManager");
var menuQuery = require("../query/menuQuery");
menuManager = new menuManager();

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
    menuList(currentPage, query, sort).then((info) => {
        res.send(info);
    })
    async function menuList() {
        let info = await menuQuery.menuListPromise(currentPage, query, sort);
        if (info.models.length > 0) {
            let menus = await  menuQuery.menuListAllPromise({});
            for (let menu of info.models) {
                let parentMenu = await menuQuery.getMenuByUUIDPromise(menu.parentId);
                if(parentMenu){
                    menu["parentMenuName"] = parentMenu.parentId == "" ? "根菜单" : parentMenu.name;
                }
            }
            info.menus = menus;
            return info;
        } else {
            let menus = await  menuQuery.menuListAllPromise({});
            info.menus = menus;
            return info;
        }
    }
})


router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    async  function getSingle(){
        var ary = [];
      let module= await menuQuery.getMenuByUUIDPromise(uuid);
      let menus= await menuQuery.menuListAllPromise({});
      ary.push({
            name: "根菜单",
            parentId: "-1",
            uuid: "-1"
      });
      ary = ary.concat(menus);
        var json = {
            menus: ary,
            menu: module
        }
        // res.send(json);
        return json

    }
    getSingle(uuid).then((json)=>{
        res.send(json);
    })
    // menuManager.findByUUID(uuid, function (err, module) {
    //
    //     var ary = [];
    //     ary.push({
    //         name: "根菜单",
    //         parentId: "-1",
    //         uuid: "-1"
    //     });
    //
    //
    //     menuManager.findAll(function (err, menus) {
    //         ary = ary.concat(menus);
    //
    //         var json = {
    //             menus: ary,
    //             menu: module
    //         }
    //         res.send(json);
    //     })
    //     // res.send(module);
    // })
})

router.get('/listByRank/:rank', function (req, res) {
    var rank = req.params.rank;
    // console.log(menuManager.find)
    menuManager.find({"rank": rank}, function (err, modules) {
        console.log(err)
        res.send(modules);
    })
});

//查找指定菜单的子菜单
router.get('/getChildMenu/:uuid', function (req, res) {
    var uuid = req.params.uuid;
    var children = getChildren(uuid);


    function getChild(uuid) {
        return new Promise(function (reslove, reject) {
            menuQuery.menuListAllPromise({"parentId": uuid},{
                order: 1
            }).then((modules)=>{
                reslove(modules);
            }).catch((err)=>{
                reject(err);
            })
        })
    }
    async function getChildren(uuid) {
        var children = await getChild(uuid);
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            var c1 = await getChild(item.uuid);
            for (var j = 0; j < c1.length; j++) {
                var item1 = c1[j];
                c2 = await getChild(item1.uuid);
                item1.children = c2;
            }
            item.children = c1;
        }
        res.send(children);
    }
});

router.post('/save', function (req, res) {
    var user = req.body;
    var uuid = user.uuid;
    menuQuery.savePromise(uuid,user).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
    // if (uuid) {
    //     menuManager.edit(uuid, user, function (err) {
    //         res.send(err == null ? "ok" : err);
    //     })
    // } else {
    //     menuManager.add(user, function (err) {
    //         res.send(err == null ? "ok" : err);
    //     })
    // }
})


router.get('/delete/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    menuQuery.deletePromise(uuid).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
    // menuManager.del(uuid, function (err) {
    //     res.send(err == null ? "ok" : err);
    // })
})

module.exports = router;