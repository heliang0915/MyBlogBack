/**
 * config 配置
 * User: heliang
 * Date: 2017/12/18.
 */
var config = {
    mongo: {
        //数据库链接地址
        // url : 'mongodb://www.blogapi.top:27017/blogTest',
        url:'mongodb://127.0.0.1:27017/blogTest',
        // url:'mongodb://3s.net579.com:15091/blogTest',
        //分页
        pageSize: 7
    },
    wx: {
        appId: "wx4abeef7a084d03d6",
        secret: "518ae3c83ad923f8eaecac20efe038b7"
    },
    redis:{
       port:6379,
       host:'127.0.0.1'//
       // host:'www.blogapi.top'
    }
}

module.exports = config;
