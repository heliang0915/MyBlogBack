var express=require("express")
var router=express.Router();
var  userManager=require("../db/userManager");
userManager=new userManager();

router.post('/list',function(req,res){

     var currentPage=req.body.page;
     var {sort,params,pageSize}=req.body;
     var query={};
     currentPage=(currentPage==null||currentPage<=0)?1:currentPage;

    if(params&&params.name){
        query['name']=new RegExp(params.name);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }

     userManager.page(currentPage, query, function(err,modules){
        res.send(modules);
    })
})


router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    userManager.findByUUID(uuid,function (err,module){
        res.send(module);
    })
})

router.post('/save',function(req,res){
    var user=req.body;
    var {uuid}=user;
    if(uuid){
        userManager.edit(uuid,user,function (err){
            res.send(err==null?"ok":err);
        })
    }else{
        // var channelModel={
        //     name,
        //     note
        // }
        userManager.add(user,function(err){
            res.send(err==null?"ok":err);
        })
    }
})


router.get('/devare/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    userManager.del(uuid,function (err){
        res.send(err==null?"ok":err);
    })
})

module.exports=router;