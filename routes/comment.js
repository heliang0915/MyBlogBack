var express = require("express")
var moment = require("moment")
var router = express.Router();
var commentManager = require("../db/commentManager");
var userManager = require("../db/userManager");
commentManager = new commentManager();
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
    if (params && params.type) {
        query['type'] = params.type;
    }

    var counter=0;
    commentManager.page(currentPage, query, function (err, modules) {
        modules.forEach(function(comment){
            counter++;
            //微信用户
            if(comment.source==1){
               var userId= comment.userId;
                userManager.find({tid:userId},function(err,users){
                    if(users.length>0){
                        comment.userName=users[0].nickName||users[0].name;
                    }else{
                        comment.userName="无";
                    }
                })
            }

            if(counter==modules.length){
                res.send(modules);
            }
        })


    })
})

router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    commentManager.findByUUID(uuid, function (err, module) {
        res.send(module);
    })
})

//查询指定博客下的评论
router.get('/getComments/:blogId', function (req, res) {
    var blogId=req.params.blogId == null ? 0 : req.params.blogId;
    commentManager.find({blogId,type:1}, function (err, comments) {
        if(comments.length) {
            var counter=0;
            comments.forEach(function(comment){
                var source=comment.source;
                var userId=comment.userId;
                var query={};
                if(source=="1"||source=="2"){ //微信评论
                    query={
                        tid:userId
                    }
                }else{
                    query={
                        userId:userId
                    }
                }
                //查询回复信息
                commentManager.find({type:2,pid:comment.uuid},function (err,children) {
                    userManager.find(query,function(err,users){
                        counter++;
                        if(users.length){
                            var user=users[0];
                            comment.userName=user.name||user.nickName;
                            comment.pic=user.pic||"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522243775023&di=cb5e5f9679153add5f237ed0cb5b94b4&imgtype=0&src=http%3A%2F%2Fpic25.photophoto.cn%2F20121216%2F0010023949794270_b.jpg";
                        }
                        comment.children=children;
                        console.log(`counter:${counter} comments.length:${comments.length}`);
                        if(counter==comments.length){
                            res.send(comments);
                        }

                    })
                })
            })
        } else{
            res.send([]);
        }
    })



    // function getInner(comments,callback) {
    //     var counter=0;
    //     comments.forEach(function(comment){
    //
    //         var source=comment.source;
    //         var userId=comment.userId;
    //         var query={};
    //         if(source=="1"||source=="2"){ //微信评论
    //             query={
    //                 tid:userId
    //             }
    //         }else{
    //             query={
    //                 userId:userId
    //             }
    //         }
    //         //查询回复信息
    //         commentManager.find({type:2,pid:comment.uuid},function (err,children) {
    //             if(children.length>0){
    //                 //获取用户信息
    //                 userManager.find(query,function(err,users){
    //                     counter++;
    //                     if(users.length){
    //                         var user=users[0];
    //                         comment.userName=user.name||user.nickName;
    //                         comment.pic=user.pic||"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522243775023&di=cb5e5f9679153add5f237ed0cb5b94b4&imgtype=0&src=http%3A%2F%2Fpic25.photophoto.cn%2F20121216%2F0010023949794270_b.jpg";
    //                     }
    //                     comment.children=children;
    //                     console.log(`counter:${counter} comments.length:${comments.length}`);
    //                     if(counter==comments.length){
    //                         callback(comments);
    //                     }
    //                 })
    //             }else{
    //                 callback(comments);
    //             }
    //         })
    //     })
    //
    // }
    //
    // function getChildren(blogId,callback){
    //     //获取评论信息
    //     commentManager.find({blogId,type:1}, function (err, comments) {
    //         if(comments.length) {
    //             getInner(comments,callback);
    //         } else{
    //             callback([]);
    //         }
    //     })
    // }






});


router.post('/save', function (req, res) {
    var comment = req.body;
    var uuid = comment.uuid;
    if (uuid) {
        commentManager.edit(uuid, comment, function (err) {
            res.send(err == null ? "ok" : err);
        })
    } else {
        comment.date=moment().format("YYYY-MM-DD HH:mm:ss");
        commentManager.add(comment, function (err) {
            res.send(err == null ? "ok" : err);
        })
    }
})
router.get('/delete/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    commentManager.del(uuid, function (err) {
        res.send(err == null ? "ok" : err);
    })
})
module.exports = router;