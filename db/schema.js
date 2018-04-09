var mongoose = require('mongoose');
var mongodb = require('../db/db');
var Schema = mongoose.Schema;
//获取数据库连接对象
var db = mongodb.connect();
/*定义栏目模型*/
var channelModel=new Schema({
     uuid:String,
     name:String, //栏目名称
     note:String,  //描述
     order:Number
})

/*定义博客模型*/
var blogModel=new Schema({
     uuid:String,
     title:String,
     content:String,
     tag:String,//标签
     pic:String,//图片
     date:String, //发布时间
     pubUser:String, //发布人
     order:Number
})
/*定义用户模型*/

var userModel=new Schema({
   uuid:String,
   nickName:String,//昵称
   name:String, //用户名
   pwd:String, //密码
   tid:String,//第三方唯一标志
   phone:String, //手机号
   loginType:String,//登录方式 0.用户名密码 1.微信 2.QQ 3.手机号登录
   loginTime:String, //登录时间
   roleId:String, //角色
   pic:String, //头像
   order:Number  //登录时间
})

//角色
var roleModel=new Schema({
   uuid:String,
   name:String, //角色名
   order:Number  //排序
})

//菜单
var menuModel=new Schema({
   uuid:String,
   name:String, //菜单名称
   url:String,//菜单地址
   rank:String,//菜单等级 1级菜单 2级菜单 3级菜单
   parentId:String,//上级菜单id
   order:Number  //排序
})

//权限映射模型
var rightModel=new Schema({
   uuid:String,
   roleId:String, //角色ID
   menus:Array,//菜单ID
   order:Number  //排序
})

//用户评论/回复模型
var commentModel=new Schema({
    uuid:String,
    userId:String, //用户ID
    blogId:String, //博客ID
    content:String,//内容
    date:String,// 评论时间
    type:Number,//是评论还是回复 1为评论2为回复
    source:String //1:微信 2:系统
})


exports.channelModel = mongoose.model('channelModel', channelModel); //  栏目集合关联
exports.blogModel = mongoose.model('blogModel', blogModel); //  博客集合关联
exports.userModel=mongoose.model('userModel',userModel); //用户模型
exports.roleModel=mongoose.model('roleModel',roleModel); //角色模型
exports.menuModel=mongoose.model('menuModel',menuModel); //菜单模型
exports.rightModel=mongoose.model('rightModel',rightModel); //权限模型
exports.commentModel=mongoose.model('commentModel',commentModel); //用户评论/回复模型




