/*给blog-web添加路由的*/
var express=require('express');
var app=express();
var router=express.Router();
let {getBlogList,mergeData,getSingle}=require("./common");
var articleQuery = require("../query/articleQuery");
var channelQuery = require("../query/channelQuery");

//获取blog数量
router.get('/getBlogTotal',function (req,res) {
    articleQuery.articleListAllPromise().then((list)=>{
        res.send(list.length.toString())
    }).catch((err)=>{
        res.send((0) .toString())
    })
})

//wx 获取单个文章
router.get('/blogSingle/:uuid', function (req, res) {
    var uuid = req.params.uuid == null ? 0 : req.params.uuid;
    getSingle(uuid).then(async (module)=>{
        let data=await mergeData(module);
        
        res.send(data);
    }).catch((err)=>{
        res.send(err);
    })
});

//web 获取文章列表
router.post('/blogList', function (req, res) {
    var currentPage = req.body.page;
    var params = req.body.params;
    currentPage = (currentPage == null || currentPage <= 0) ? 1 : currentPage;
    var pageSize=req.body.pageSize||10;
    console.log("方法调用开始....");
    var startTime=Date.now();
    console.log("currentPage:::::::::"+currentPage);
    getBlogList(params,currentPage,pageSize,true).then(async (info)=>{
        console.log("方法调用合并方法开始....");
        let data=await mergeData(info,true);
        var end=Date.now();
        console.log("方法调用合并方法结束....");
        console.log("API  方法总耗时：：：："+(end-startTime)+"ms");
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    })
});


//web 获取指定栏目下的子栏目
router.get('/channelChild/:uuid', function (req, res) {
    let {uuid}=req.params;
    channelQuery.pagePromise(1,{pid:uuid},{order:-1},10).then((info)=>{
        let models=info.models;
        res.send(models);
    })
});

//上下翻页
// router.get('/blogPage/:uuid/:direction',function (req,res) {
//
//     let blogList=app.locals.blogList;
//     console.log("blogList"+app.locals);
//     let {uuid,direction}=req.params;
//     let index=-1;
//     for(let i=0;i<blogList.length;i++){
//          let blog= blogList[i];
//         if(blog.uuid==uuid){
//             index=i;
//             break;
//         }
//     }
//     if(direction=='pre'){ //向上翻页
//         index+=1;
//     }else{   //向下翻页
//         index-=1;
//     }
//     if(index>blogList.length.length-1){
//         index=blogList.length.length-1;
//     }else if(index<0){
//         index=0;
//     }
//     return  blogList[index];
//
//
//
// })
module.exports=router;
