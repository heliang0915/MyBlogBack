var express=require("express")
var router=express.Router();
var  {roleManager}=require("../db/modelManager");
var  roleQuery=require("../query/roleQuery");
// roleManager=new roleManager();

router.post('/list',function(req,res){
     var currentPage=req.body.page;
     var sort=req.body.sort;
     var params=req.body.params;
     var pageSize=req.body.pageSize;
     var query={};
     currentPage=(currentPage==null||currentPage<=0)?1:currentPage;

    if(params&&params.name){
        query['name']=new RegExp(params.name);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }

    roleQuery.roleListPromise(currentPage, query,sort).then((modules)=>{
        res.send(modules);
    }).catch((err)=>{
        res.send(err);
    })

    //  roleManager.page(currentPage, query, function(err,modules){
    //     res.send(modules);
    // })


})


router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    roleQuery.getRoleByUUIDPromise(uuid).then((module)=>{
        res.send(module);
    }).catch((err)=>{
        res.send(err);
    })

    // roleManager.findByUUID(uuid,function (err,module){
    //     res.send(module);
    // })
})

router.post('/save',function(req,res){
    var role=req.body;
    var uuid=role.uuid;

    roleQuery.savePromise(uuid,user).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
    // if(uuid){
    //     roleManager.edit(uuid,role,function(err){
    //         res.send(err==null?"ok":err);
    //     })
    // }else{
    //     roleManager.add(role,function(err){
    //         res.send(err==null?"ok":err);
    //     })
    // }
})


router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    roleQuery.deletePromise(uuid).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
    // roleManager.del(uuid,function(err){
    //     res.send(err==null?"ok":err);
    // })
})

module.exports=router;