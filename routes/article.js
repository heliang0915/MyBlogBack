var express=require("express")
var moment=require("moment");
var cheerio=require("cheerio");
var router=express.Router();

var  channelQuery= require("../query/channelQuery");
var  articleQuery= require("../query/articleQuery");


var  channelManager= require("../db/channelManager");

channelManager=new channelManager();
var  blogManager=require("../db/blogManager");
blogManager=new blogManager();
var zanManager = require("../db/zanManager");
zanManager = new zanManager();
var AppConst = require("../const/APPConst");


router.post('/list',function(req,res){
     // blogManager.setModelName("blogModel");
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
        let info = await articleQuery.articleListPromise();
        let channels = await channelQuery.getChannelALLPromise();
        if(info.models.length>0) {
            for(let i=0;i<info.models.length;i++){
               let  blog=info.models[i];
               let channel= await channelQuery.getChannelPromise(blog.tag);
                blog["channelName"] = channel.name;
                blog["content"] = blog.content.substring(0, 120);
                if(i==info.models.length-1){
                    info.channels=channels;
                    res.send(info);
                }
            }
        }else{
            info.channels=channels;
            console.log("返回给服务")
            res.send(info);
        }
    }

    getBlogList();

})






router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.findAll(function (err,channels){
        if(err){
            res.send({});
        }else{
            blogManager.findByUUID(uuid,function (err,module){
                channelManager.findByUUID(module.tag,function (err,channel){
                    module["channelName"]=channel.name;
                    var $=cheerio.load(module.content);
                    var regText=/<p.*?>(.*?)<\/p>/g;
                    var imgReg=/<img(.*?)>(.*?)<\/img>/g;
                    var ary=[];
                   module.content.replace(regText,function(item,small){
                        item=small.replace(/&nbsp/g,'').replace(/;/g,'').replace(/<br>/,'');
                       var $=cheerio.load(item);
                       var src=$("img").attr('src');
                       var json={}
                       if(src){
                           json.type="image";
                           json.text=src;
                           ary.push(json);
                       }else{
                           json.type="text";
                           json.text=item;
                           ary.push(json);
                       }
                    });
                    module.contentAry=ary;
                    var json={
                        channels,
                        module
                    }
                    res.send(json);
                })
            })
        }
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

    if(uuid){
        blogManager.edit(uuid,article,function (err){
            res.send(err==null?"ok":err);
        })
    }else{
        var articleModel={
            title,
            content,
            tag,
            pic,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            pubUser:pubUser==null?"张三":pubUser
        }
        blogManager.add(articleModel,function(err){
            res.send(err==null?"ok":err);
        })
    }
})

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    blogManager.del(uuid,function (err){
        res.send(err==null?"ok":err);
    })
})

module.exports=router;