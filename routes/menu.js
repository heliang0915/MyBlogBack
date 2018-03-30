var express=require("express")
var router=express.Router();
var  menuManager=require("../db/menuManager");
menuManager=new menuManager();

router.post('/list',function(req,res){

     var currentPage=req.body.page;
     var {sort,params,pageSize}=req.body;
     var query={};
     currentPage=(currentPage==null||currentPage<=0)?1:currentPage;

     console.log(sort);
    if(params&&params.name){
        query['name']=new RegExp(params.name);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }

    var ary=[];
    var counter=0;
     menuManager.page(currentPage, query, function(err,info){
        if(info.models.length>0){
            menuManager.findAll((err,menus)=>{
                info.models.forEach((menu)=>{
                    //查询信息
                    menuManager.findByUUID(menu.parentId,(err,parentMenu)=>{
                        // console.log(parentMenu.parentId);
                        counter++;
                        menu["parentMenuName"]=parentMenu.parentId==""?"根菜单":parentMenu.name;
                        if(counter==info.models.length){
                            info.menus=menus;
                            res.send(info);
                        }
                    })
                })
            })
        }else{
            menuManager.findAll((err,menus)=>{
                info.menus=menus;
                res.send(info);
            });
        }


            // console.log(modules);
        // info.models.forEach((menu)=>{
        //     console.log(menu.uuid);
        //     menuManager.findByUUID(menu.uuid,(err,module)=>{
        //         // console.log(module)
        //         counter++;
        //         console.log(counter)
        //         menu["parentMenuName"]=module.name;
        //         ary.push(menu);
        //         // console.log("counter>>>"+counter)
        //         if(counter==modules.models.length){
        //             // info.channels=channels;
        //             console.log(ary);
        //             res.send(ary);
        //         }
        //     })
        // })
        // res.send(modules);
    },sort)
})


router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    menuManager.findByUUID(uuid,(err,module)=>{

        var ary=[];
        ary.push({
                name:"根菜单",
                parentId:"-1",
                uuid:"-1"
            });
        menuManager.findAll((err,menus)=>{
           ary= ary.concat(menus);

            let json={
                menus:ary,
                menu:module
            }
            res.send(json);
        })
        // res.send(module);
    })
})

router.get('/listByRank/:rank',function(req,res){
    let rank=req.params.rank;
    // console.log(menuManager.find)
    menuManager.find({"rank":rank},(err,modules)=>{
        console.log(err)
         res.send(modules);
    })
});  

//查找指定菜单的子菜单
router.get('/getChildMenu/:uuid',function(req,res){
    let uuid=req.params.uuid;
    // console.log(menuManager.find)
    // menuManager.find({"parentId":uuid},(err,modules)=>{
    //      console.log(err)


    //      res.send(modules);
    // })


     let   children= getChildren(uuid);

       function getChild(uuid){
            return new Promise((reslove,reject)=>{
                menuManager.find({"parentId":uuid},(err,modules)=>{
                    console.log(modules);
                        if(err){
                            reject(err);
                        }else{

                           reslove(modules); 
                        }
                });
            })
       }

     async function getChildren(uuid){
        let children=await getChild(uuid);
        for(var i=0;i<children.length;i++){
            var item=children[i];
            var c1=await getChild(item.uuid);
            for(var j=0;j<c1.length;j++){
                var item1=c1[j];
                c2=await getChild(item1.uuid);
                item1.children=c2;
            }
            item.children=c1;
        }

            // return children;
            res.send(children);
        // console.log(JSON.stringify(children));
   }
});  



router.post('/save',function(req,res){
    let user=req.body;
    let {uuid}=user;
    if(uuid){
        menuManager.edit(uuid,user,(err)=>{
            res.send(err==null?"ok":err);
        })
    }else{
        // var channelModel={
        //     name,
        //     note
        // }
        menuManager.add(user,function(err){
            res.send(err==null?"ok":err);
        })
    }
})


router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    menuManager.del(uuid,(err)=>{
        res.send(err==null?"ok":err);
    })
})

module.exports=router;