var express = require('express');
var router = express.Router();
var process = require('child_process');
router.all('*', function(req, res, next) {
    res.type('html');
    next();
});

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/reload',function (req,res) {
    reload();
    res.render('reload');
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
