var express=require("express")
var router=express.Router();
var  channelManager=require("../db/channelManager")

router.get('/',function(req,res){
    res.send("频道首页")
})

router.get('/list',function(req,res){
    var currentPage=req.query.page;
    console.log(currentPage);
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    channelManager.page(currentPage, {}, function(err,modules){
        res.send(modules);
    })
    // channelManager.findAll(function (err,modules){
    //     res.send(modules);
    // })
})

router.get('/save',function(req,res){
    var channelModel={
        name:"CSS3",
        node:"CSS3技术分享"
    }
    channelManager.add(channelModel,function(err){
        res.send(err==null?"成功":err);
    })
})


module.exports=router;