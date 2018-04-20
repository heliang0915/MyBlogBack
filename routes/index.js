var express = require('express');
var router = express.Router();
var process = require('child_process');
// var config = require('../config');

router.all('*', function(req, res, next) {
    res.type('html');
    next();
});

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/reload',function (req,res) {
    reload();
    // res.end("<html><head></head><body><script>setTimeout(function(){alert('重启完毕');window.reload()},3000)</script></body></html>")
    // setTimeout(()=>{
    //     console.log("准备跳转....");
    //     res.send("<script>setTimeout(alert('重启完毕');window.reload())</script>")
    // },5000)
    // process.on('uncaughtException', function (err) {
    //     console.log('Caught exception: ' + err);
    // });
    res.render('reload');
})


function  reload(callback) {
    let reloadSh="sh reload.sh";
    console.log("执行reload脚本开始.....");
    process.exec(`${reloadSh}`,function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            // res.send(`exec error: ${error}`);
        }else{
            console.log(`命令:${reloadSh} 执行成功`);
            // callback();
        }
    })
}



module.exports = router;
