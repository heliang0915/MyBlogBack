var express=require("express")
var moment=require("moment");
var util=require("../util/util");
var router=express.Router();
var  channelQuery= require("../query/channelQuery");
var  articleQuery= require("../query/articleQuery");
var  userQuery= require("../query/userQuery");

//获取文章列表
router.post('/list',function(req,res){
    var currentPage=req.body.page;
    // console.log(req.headers);
    var params=req.body.params;
    var pageSize=req.body.pageSize||10;

    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    var query={};
    if(params&&params.title){
        query['title']=new RegExp(params.title);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }
    async function getBlogList() {
        let info = await articleQuery.articleListPromise(currentPage,query,{
            date:-1
        },pageSize);
        let channels = await channelQuery.getChannelALLPromise();
        if(info.models.length>0) {
            for(let i=0;i<info.models.length;i++){
               let  blog=info.models[i];
               let channel= await channelQuery.getChannelByUUIDPromise(blog.tag);
               if(channel){
                    console.dir(JSON.stringify(channel));
                    blog["channelName"] = channel.name;
                    blog["content"] = blog.content.substring(0, 120);
               }
            }
        }
        info.channels=channels;
        return info;
    }
    getBlogList().then((info)=>{
        res.send(info);
    }).catch((err)=>{
        console.log("er>>>"+err);
        res.send(err);
    });
})


router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    async  function  getSingle(uuid){
       let channels= await  channelQuery.getChannelALLPromise();
        console.log("channels::::"+JSON.stringify(channels));
       let blog={};
       if(uuid!=0){
           blog=await articleQuery.getArticleByUUIDPromise(uuid);
           // let channel=await channelQuery.getChannelByUUIDPromise(blog.tag);

           // if(channel){
           //     blog["channelName"]=channel.name;
           // }
       }
        var json={
            channels,
            module:blog
        }
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
        var contentTxt=article.contentTxt;
        var uuid=article.uuid;
        var tag=article.tag;
        var pic=article.pic;
        // var pubUser=article.pubUser;
        let userId=util.userUtil.getTokenFromReq(req);
        // console.log("userID:::::::::::"+userId);
        async function saveArticle() {
           let userModel=await userQuery.getUserByUUIDPromise(userId);
            var articleModel={
                title,
                content,
                contentTxt,
                tag,
                pic,
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
                pubUser:(userModel==null?"平台默认":(userModel.nickName||userModel.name))
            }
           await  articleQuery.savePromise(uuid,uuid==null?articleModel:article);
        }

        saveArticle().then(()=>{
            res.send("ok");
        }).catch((err)=>{
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
