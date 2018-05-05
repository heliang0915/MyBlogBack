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

    roleQuery.savePromise(uuid,role).then(()=>{
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


//保存权限信息
router.post('/saveRight',function(req,res){
    let {menus,roleId}=req.body;
    // let menus=["7099b1732765488eb17a08594b0b534e","2da38a9b3f5e429bb8306e5f0488eb97","2da38a9b3f5e429bb8306e5f0488eb97"];
    // let roleId="4301f74934b248bd98f0b55f1aef02bd";
    roleQuery.saveRoleRight(roleId,menus).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
})
//根据角色ID查询权限菜单信息
router.get('/getMenusByRoleId/:roleId',function(req,res){
    var roleId=req.params.roleId==null?0:req.params.roleId;
    roleQuery.getRightByRoleId(roleId).then((rightModels)=>{
        if(rightModels.length>0){
            let model=rightModels[0];
            res.send( model.menus);
        }else{
            res.send([]);
        }
    }).catch((err)=>{
        res.send(err);
    })
})


module.exports=router;