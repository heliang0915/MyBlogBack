let cache=require('./cache');
var  modelManager=require("../../db/modelManager");
let {cacheAry}=require("../const/cacheConst");


//初始化Manager 做new的动作 如：blogManager=new blogManager();
for(let manager in modelManager){
    let managerStr=`
        var ${manager} =modelManager.${manager} ;
        ${manager}=new ${manager}();
             `;
    eval(managerStr);
}



//将查询全部动作 放入这里
let cacheManager={
    init(){
        this.createCacheFns();
        this.reloadAll();
        return this;
    },
    reloadAll(){
        for(let item of cacheAry){
            let key=Object.keys(item)[0];
            let lunchFn = `this.${key}All();`
            eval(lunchFn)
        }
    },
    getChannelNameById(channels,tag){
      let channelName="";
      for(let channel of channels){
        if(tag==channel.uuid){
            channelName=channel.name;
            break;
        }
      }
      return channelName;
    },
    createCacheFns(){
        let self=this;
        cacheAry.forEach((config)=>{
            let key=Object.keys(config)[0];
            let val=config[key];
            let fn=`
            let ${key}All= ()=>{
                 //加载${val}信息
                    ${key}Manager.findAll(function (err, models) {
                        if (err) {
                            reject(err)
                        } else {
                          if(key=="blog"){ //加载到blog了 这里我们将频道信息中的名字加载到blog对象数组中
                            channelManager.findAll(function (err, channels) {
                              models.forEach((model)=>{
                                  let tag=model.tag;
                                  let channelName=self.getChannelNameById(channels,tag);
                                  model.channelName=channelName;
                              })
                              // models.forEach((model)=>{
                              //   console.log("model::::"+model.channelName);
                              // });
                              cache.set("${key}:all", models, (err) => {
                                  console.log(err==null?"加载[${val}]缓存["+models.length+"]个":err);
                              })
                            });
                          }else{
                            cache.set("${key}:all", models, (err) => {
                                console.log(err==null?"加载[${val}]缓存["+models.length+"]个":err);
                            })
                          }
                        }
                    });
            }
             cacheManager['${key}All']=${key}All;
            `;
            eval(fn)
        })
    }
}
module.exports=cacheManager.init();
