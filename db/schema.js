var mongoose = require('mongoose');
var mongodb = require('../db/db');
var Schema = mongoose.Schema;
//获取数据库连接对象
var db = mongodb.connect();
/*定义栏目模型*/
var channelModel=new Schema({
     uuid:String,
     name:String, //栏目名称
     node:String,  //描述
     order:Number
})

/*定义博客模型*/
var blogModel=new Schema({
     uuid:String,
     title:String,
     content:String,
     tag:String,//标签
     date:String, //发布时间
     pubUser:String, //发布人
     order:Number
})

exports.channelModel = mongoose.model('channelModel', channelModel); //  栏目集合关联
exports.blogModel = mongoose.model('blogModel', blogModel); //  博客集合关联