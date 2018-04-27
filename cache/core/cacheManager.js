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
    createCacheFns(){
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
                            cache.set("${key}:all", models, (err) => {
                                console.log(err==null?"加载[${val}]缓存["+models.length+"]个":err);
                            })
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