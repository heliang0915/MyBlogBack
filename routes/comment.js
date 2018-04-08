var express = require("express")
var router = express.Router();
var commentManager = require("../db/commentManager");
commentManager = new commentManager();

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

    commentManager.page(currentPage, query, function (err, modules) {
        res.send(modules);
    })
})

router.get('/single/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    commentManager.findByUUID(uuid, function (err, module) {
            res.send(module);
    })
})

router.post('/save', function (req, res) {
    var comment = req.body;
    var uuid = comment.uuid;
    if (uuid) {
        commentManager.edit(uuid, comment, function (err) {
            res.send(err == null ? "ok" : err);
        })
    } else {
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