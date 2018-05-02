var express=require("express")
var moment=require("moment");
var router=express.Router();
var  channelQuery= require("../query/channelQuery");
var  articleQuery= require("../query/articleQuery");

//获取文章列表
router.post('/list',function(req,res){
    var currentPage=req.body.page;
    var params=req.body.params;
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    var query={};
    if(params&&params.title){
        query['title']=new RegExp(params.title);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }
    async function getBlogList() {
        let info = await articleQuery.articleListPromise(currentPage,query);
        let channels = await channelQuery.getChannelALLPromise();
        if(info.models.length>0) {
            for(let i=0;i<info.models.length;i++){
               let  blog=info.models[i];
               let channel= await channelQuery.getChannelByUUIDPromise(blog.tag);
                blog["channelName"] = channel.name;
                blog["content"] = blog.content.substring(0, 120);
                if(i==info.models.length-1){
                    info.channels=channels;
                    res.send(info);
                }
            }
        }else{
            info.channels=channels;
            var end=new Date().getTime();
            console.log("返回给服务"+"耗时:"+(end-start)+"ms")
            res.send(info);
        }
    }
    getBlogList();
})


router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;

    async  function  getSingle(uuid){
       let channels= await  channelQuery.getChannelALLPromise();
       let blog={};
       if(uuid!=0){
           blog=await articleQuery.getArticleByUUIDPromise(uuid);
           let channel=await channelQuery.getChannelByUUIDPromise(blog.tag);
           blog["channelName"]=channel.name;
       }
        var json={
            channels,
            module:blog
        }
        // console.log(json);
        return json;
    }

    getSingle(uuid).then((json)=>{
        res.send(json);
    })
})

router.post('/save',function(req,res){
    var article=req.body;
    var title=article.title;
    var content=article.content;
    var uuid=article.uuid;
    var tag=article.tag;
    var pic=article.pic;
    var pubUser=article.pubUser;
    var articleModel={
        title,
        content,
        tag,
        pic,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        pubUser:pubUser==null?"张三":pubUser
    }

    articleQuery.savePromise(uuid,uuid==null?articleModel:article).then((err)=>{
        res.send("ok");
    }).catch(()=>{
        res.send(err);
    })

})

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
     articleQuery.deletePromise(uuid).then((err)=>{
         res.send("ok");
     }).catch(()=>{
         res.send(err);
     })
})

//增加pv数量
router.get('/addPv/:uuid',(req,res)=>{
    var uuid=req.params.uuid==null?0:req.params.uuid;
    articleQuery.addPVPromise(uuid).then(()=>{
        res.send("ok");
    }).catch((err)=>{
        res.send(err);
    })
})

module.exports=router;