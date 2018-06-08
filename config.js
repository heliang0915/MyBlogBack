/**
 * config 配置
 * User: heliang
 * Date: 2017/12/18.
 */
var config = {
    mongo: {
        //数据库链接地址
        // url: 'mongodb://62b4a3b21cff4:60ae51958af04@10.0.0.26:30097/c0c2d08b56244',
        url : 'mongodb://www.blogapi.top:27017/blogTest',
        
        //分页
        pageSize: 7
    },
    wx: {
        appId: "wx4abeef7a084d03d6",
        secret: "c6b6640c61f02815312c810f79507778"
    },
    redis:{
       port:6379,
       host:'127.0.0.1'
    }
}

module.exports = config;