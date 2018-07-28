var express = require("express")
var router = express.Router();
var {commentManager, userManager, blogManager} = require("../db/modelManager");
let commentQuery = require("../query/commentQuery");
let userQuery = require("../query/userQuery");
let articleQuery = require("../query/articleQuery");

commentManager = new commentManager();
userManager = new userManager();
blogManager = new blogManager();

router.post('/list', function (req, res) {
    var currentPage = req.body.page;
    var sort = req.body.sort;
    var params = req.body.params;
    var pageSize = req.body.pageSize;
    var query = {};
    currentPage = (currentPage == null || currentPage <= 0) ? 1 : currentPage;

    if (params && params.name) {
        query['content'] = new RegExp(params.name);
    }
    if (params && params.type) {
        query['type'] = params.type;
    }
    async function getCommentList(currentPage, query, sort, pageSize) {
        let info = await commentQuery.pagePromise(currentPage, query, sort, pageSize);
        // console.log(info);
        var modules = info.models;
        for (let comment of modules) {
            //微信用户
            if (comment.source == '1') {
                var userId = comment.userId;
                var blogId = comment.blogId;

                let users = await userQuery.userListAllPromise({tid: userId});

                let blog = await articleQuery.getArticleByUUIDPromise(blogId)
                // console.log(blog);
                if (users.length > 0) {
                    comment.userName = users[0].nickName || users[0].name;
                } else {
                    comment.userName = "无";
                }
                if(blog&&blog.title){
                  comment.blogName = blog.title;
                }
            }
        }
        return info;
    }
    getCommentList(currentPage, query, sort, pageSize).then((info) => {
        // console.log(info);
        res.send(info);
    })

})

router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    commentQuery.getCommentByUUIDPromise(uuid).then((module) => {
        res.send(module);
    }).catch((err) => {
        res.send(err);
    })
})

//查询指定博客下的评论
router.get('/getComments/:blogId', function (req, res) {
    var blogId = req.params.blogId == null ? 0 : req.params.blogId;

    getComments(blogId).then((comments) => {
        res.send(comments);
    }).catch((err) => {
        res.send(err);
    })

    async function getComments(blogId) {
        let comments = await commentQuery.commentListByQueryPromise({blogId, type: 1});
        if (comments.length) {
            // var counter=0;
            for (let comment of  comments) {
                var source = comment.source;
                var userId = comment.userId;
                var query = {};
                if (source == "1" || source == "2") { //微信评论
                    query = {
                        tid: userId
                    }
                } else {
                    query = {
                        userId: userId
                    }
                }
                comment.content = comment.content.replace(/\[em_(\d+)\]/g, (r1, r2) => {
                    return `<img src='http://www.jq22.com/demo/qqFace/arclist/${r2}.gif' />`;
                })

                let children = await commentQuery.commentListByQueryPromise({type: 2, pid: comment.uuid});
                let users = await userQuery.userListAllPromise(query);
                if (users.length) {
                    var user = users[0];
                    comment.userName = user.name || user.nickName;
                    comment.pic = user.pic || "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522243775023&di=cb5e5f9679153add5f237ed0cb5b94b4&imgtype=0&src=http%3A%2F%2Fpic25.photophoto.cn%2F20121216%2F0010023949794270_b.jpg";
                }
                children.forEach((com) => {
                    com.content = com.content.replace(/\[em_(\d+)\]/g, (r1, r2) => {
                        return `<img src='http://www.jq22.com/demo/qqFace/arclist/${r2}.gif' />`;
                    })
                })
                comment.children = children;
            }
            return comments;
        } else {
            return [];
        }
    }
});

router.post('/save', function (req, res) {
    var comment = req.body;
    var uuid = comment.uuid;
    commentQuery.saveCommentPromise(uuid, comment).then(() => {
        res.send("ok");
    }).catch((err) => {
        res.send(err);
    })
})
router.get('/delete/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    delComment(uuid).then((msg) => {
        res.send(msg);
    }).catch((err) => {
        res.send(err);
    })
    async function delComment(uuid) {
        let comments = await  commentQuery.commentListByQueryPromise({pid: uuid});
        if (comments.length) {
            return "该评论下有回复不能删除";
        } else {
            let msg = await commentQuery.deleteCommentPromise(uuid);
            return msg == null ? "ok" : msg;
        }
    }
})
module.exports = router;
