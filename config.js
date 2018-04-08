/**
 * config 配置
 * User: heliang
 * Date: 2017/12/18.
 */
var config = {
    mongo: {
        //数据库链接地址
        url: 'mongodb://ef57a57894bd4:99ed58894fe04@10.0.0.25:30096/69a9aa5fdb354',
        // url : 'mongodb://localhost:27017/myBlog',
        //分页
        pageSize: 7
    },
    wx: {
        appId: "wx4abeef7a084d03d6",
        secret: "c6b6640c61f02815312c810f79507778"
    }
}

module.exports = config;