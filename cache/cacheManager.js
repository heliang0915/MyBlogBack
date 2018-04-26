let cache=require('./cache');
let {blogManager,channelManager}=require('../db/modelManager');
let cacheAry=[{"blog":"文章"},{"channel":"频道"}];
blogManager = new blogManager();
channelManager = new channelManager();

let cacheManager={
    init(){
        this.createFns();
        for(let item of cacheAry){
            let key=Object.keys(item)[0];
            let lunchFn = `this.${key}All();`
            eval(lunchFn)
        }
    },
    createFns(){
        cacheAry.forEach((config)=>{
            let key=Object.keys(config)[0];
            let val=config[key];

            let fn=`
            let fn= ()=>{
                 //加载${val}信息
                // return new Promise((resolve, reject)=> {
                    ${key}Manager.findAll(function (err, models) {
                        if (err) {
                            reject(err)
                        } else {
                            cache.set("${key}:all", models, (err) => {
                                console.log(err==null?"加载[${val}]缓存["+models.length+"]个":err);
                            })
                        }
                    });
                // });
            }
             cacheManager['${key}All']=fn;  
            `;
            eval(fn)
        })
    }
}
module.exports=cacheManager.init();