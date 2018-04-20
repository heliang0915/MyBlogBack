var express=require("express")
var router=express.Router();
var  channelQuery= require("../query/channelQuery");

router.post('/list',function(req,res){
    var currentPage=req.body.page.cur;
    var sort=req.body.sort;
    var params=req.body.page.params;
    var pageSize=req.body.pageSize;
    var query={};
    if(params&&params.title){
        query['name']=new RegExp(params.title);
    }
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    channelQuery.pagePromise(currentPage, query,sort,pageSize).then(modules=>{
        res.send(modules);
    }).catch((err)=>{
        res.send(err);
    })
})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelQuery.getChannelPromise(uuid).then((module)=>{
        res.send(module);
    }).catch((err)=>{
        res.send(err);
    })
})

router.post('/save',function(req,res){
    var channel=req.body;
    var name=channel.name;
    var note=channel.note;
    var uuid=channel.uuid;
    var channelModel={
        name,
        note
    }
    channelQuery.savePromise(uuid,uuid==null?channelModel:channel).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
})

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelQuery.deletePromise(uuid).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
})

module.exports=router;