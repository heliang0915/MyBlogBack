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
    sort=sort==null?{order:-1}:sort;
    channelQuery.pagePromise(currentPage, query,sort,pageSize).then(info=>{
        res.send(info);
    }).catch((err)=>{
        res.send(err);
    })
})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    var info={};
    channelQuery.getChannelByUUIDPromise(uuid).then((module)=>{
        channelQuery.getChannelAllTree(uuid).then((channels)=>{
            info.channel=module;
            info.channels=channels;
            console.log("info::::::"+JSON.stringify(info));
            res.send(info);
        })
    }).catch((err)=>{
        res.send(err);
    })
})

router.post('/save',function(req,res){
    var channel=req.body;
    var name=channel.name;
    var note=channel.note;
    var uuid=channel.uuid;
    var rank=channel.rank;
    var pid=channel.pid;
    var channelModel={
        name,
        note,
        rank,
        pid
    }
    channelQuery.savePromise(uuid,uuid==null?channelModel:channel).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
})

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;

    channelQuery.getChannelByPid(uuid).then((children)=>{
        if(children.length==0){
            channelQuery.deletePromise(uuid).then(()=>{
                res.send("ok");
            }).catch((err)=>{
                res.send(err);
            })
        }else{
            res.send("该栏目下有子栏目不允许删除");
        }
    })
})

module.exports=router;