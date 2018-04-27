/* 缓存 */
const redis = require('redis');
const redisConf= require('../../config');
let cache={
    client:null,
    connect(){
        this.client =redis.createClient(redisConf.redis)
        this.client.on("error", function (err) {
            console.log("Error " + err);
        });
        this.client.on('ready', function () {
            console.log('redisCache connection succeed');
        });
    },
    set(key,obj,callback){
        let value=JSON.stringify(obj);
        this.client.set(key,value,callback);
    },
    get(key,callback){
        this.client.get(key,(err,value)=>{
            let obj=JSON.parse(value)
            callback(err,obj);
        });
    },
    exists(key,callback){
        this.client.exists(key,(err,res)=>{
            callback(err,res==1?true:false);
        });
    },
    init() {
        //创建连接
        this.connect();
        return this;
    }
}
module.exports=cache.init();