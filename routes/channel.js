var express=require("express")
var router=express.Router();
var  channelManager=require("../db/channelManager");
channelManager=new channelManager();
router.post('/list',function(req,res){
    var currentPage=req.body.page;
    // var {sort,params,pageSize}=req.body;
    var sort=req.body.sort;
    var params=req.body.params;
    var pageSize=req.body.pageSize;

    // console.log(pageSize);
    // var sort=req.body.sort;
    var query={};
    // query=Object.assign({},query,params);

    // if(params&&params.title){
    //     query['name']=new RegExp(params.title);
    // }
    // if(params&&params.tag){
    //     query['tag']=params.tag;
    // }
    // console.log(pageSize);
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
     channelManager.page(currentPage, query, function(err,modules){
        res.send(modules);
    },sort,pageSize)

})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.findByUUID(uuid,function (err,module){
        res.send(module);
    })
})

router.post('/save',function(req,res){
    var channel=req.body;
    var name=channel.name;
    var note=channel.note;
    var uuid=channel.uuid;
    // var {name,note,uuid}=channel;
    if(uuid){
        channelManager.edit(uuid,channel,function(err){
            res.send(err==null?"ok":err);
        })
    }else{
        var channelModel={
            name,
            note
        }
        channelManager.add(channelModel,function(err){
            res.send(err==null?"ok":err);
        })
    }

})

router.get('/devare/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.del(uuid,function (err){
        res.send(err==null?"ok":err);
    })
})

// router.get('/a',function(req,res){
//     res.set
//     res.render('canvas');
//
// })


module.exports=router;