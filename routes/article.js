var express=require("express")
var moment=require("moment")
var router=express.Router();
var  channelManager=require("../db/channelManager");
var  blogManager=require("../db/blogManager");

router.all('*',function(req,res,next){
    blogManager.setModelName("blogModel");
    next();
})


router.get('/list',function(req,res){
    var currentPage=req.query.page;
    currentPage=(currentPage==null||currentPage<=0)?1:currentPage;
    blogManager.page(currentPage, {}, function(err,info){
        channelManager.setModelName("channelModel");
        var counter=0;
        info.models.forEach((article)=>{
            channelManager.findByUUID(article.tag,(err,channel)=>{
                counter++;
                article["channelName"]=channel.name;
                article["content"]=article.content.substring(0,120);
                if(counter==info.models.length){
                    blogManager.setModelName("blogModel");
                    res.send(info);
                }
            })
        })
    })
})
router.get('/single/:uuid',function(req,res){
    var uuid=req.params.uuid==null?0:req.params.uuid;
    channelManager.setModelName("channelModel");
    channelManager.findAll((err,channels)=>{
        if(err){
            res.send({});
        }else{
            blogManager.setModelName("blogModel");
            blogManager.findByUUID(uuid,(err,module)=>{
                let json={
                    channels,
                    module
                }
                res.send(json);
            })
        }
    })
})

router.post('/save',function(req,res){
    let article=req.body;
    console.log("article>>>>>"+JSON.stringify(article));
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
        console.log(JSON.stringify(articleModel));
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