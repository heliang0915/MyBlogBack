var express=require("express")
var moment=require("moment");
var cheerio=require("cheerio");
var router=express.Router();
var  channelManager= require("../db/channelManager");
channelManager=new channelManager();
var  blogManager=require("../db/blogManager");
blogManager=new blogManager();

router.post('/list',function(req,res){
     // blogManager.setModelName("blogModel");
    var currentPage=req.body.page;
    var params=req.body.params;
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    // console.log("params>>>>"+JSON.stringify(params));
    var query={};
    // query=Object.assign({},query,params);
    if(params&&params.title){
        query['title']=new RegExp(params.title);
    }
    if(params&&params.tag){
        query['tag']=params.tag;
    }

    //查询文章列表
    blogManager.page(currentPage, query, function(err,info){
        var counter=0;
        if(info.models.length>0){
            //获取所有分类
            channelManager.findAll((err,channels)=>{
                info.models.forEach((article)=>{
                    //查询频道信息
                    channelManager.findByUUID(article.tag,(err,channel)=>{
                        counter++;
                        article["channelName"]=channel.name;
                        article["content"]=article.content.substring(0,120);
                        if(counter==info.models.length){
                            info.channels=channels;
                            res.send(info);
                        }
                    })
                })
            })
        }else{
            channelManager.findAll((err,channels)=>{
                info.channels=channels;
                res.send(info);
            });
        }
     }
    )
})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.findAll((err,channels)=>{
        if(err){
            res.send({});
        }else{
            blogManager.findByUUID(uuid,(err,module)=>{
                channelManager.findByUUID(module.tag,(err,channel)=>{
                    module["channelName"]=channel.name;
                    var $=cheerio.load(module.content);
                    // var ps=$('p');
                    // ps.each(function () {
                    //     console.log($(this).html());
                    // })
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

                    // console.log(ary);
                    module.contentAry=ary;
                    let json={
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
    let article=req.body;
    let {title,content,uuid,tag,pic}=article;
    if(uuid){
        blogManager.edit(uuid,article,(err)=>{
            res.send(err==null?"ok":err);
        })
    }else{
        var articleModel={
            title,
            content,
            tag,
            pic,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            pubUser:'张三'
        }
        blogManager.add(articleModel,function(err){
            res.send(err==null?"ok":err);
        })
    }
})

router.get('/delete/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    blogManager.del(uuid,(err)=>{
        res.send(err==null?"ok":err);
    })
})

module.exports=router;