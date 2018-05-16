var express=require("express")
var router=express.Router();
var  rightQuery=require("../query/rightQuery");
// userManager=new userManager();

router.get('/:userId',function (req,res) {
    let userId=req.params.userId==null?0:req.params.userId;
      async  function getMenusByUserId(userId) {
          return await rightQuery.getMenusByUserIdPromise(userId);
     }
    getMenusByUserId(userId).then((menus)=>{
        res.send(menus)
    }).catch((err)=>{
        res.send(err)
    })
})
module.exports=router;