var express=require("express")
var router=express.Router();
var  channelManager=require("../db/channelManager")

router.all('*',function(req,res,next){
    channelManager.setModelName("channelModel");
    next();
})



router.get('/list',function(req,res){
    var currentPage=req.query.page;
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    channelManager.page(currentPage, {}, function(err,modules){
        res.send(modules);
    })
})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;

    channelManager.findByUUID(uuid,(err,module)=>{
        res.send(module);
    })
})

router.post('/save',function(req,res){
    let channel=req.body;
    let {name,note,uuid}=channel;
    console.log("uuid>>>"+uuid)
    if(uuid){
        channelManager.edit(uuid,channel,(err)=>{
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

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.del(uuid,(err)=>{
        res.send(err==null?"ok":err);
    })
})


module.exports=router;