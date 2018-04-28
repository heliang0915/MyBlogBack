/**
 *  缓存查询使用 查询
 *
 */
let config=require("../../config")
let query={
    //做内存 sort
    filterByQuery:(query,modules)=>{
        return modules.filter((item)=>{
            let flag=true;
            for(let filed in query){
                let val=query[filed];
                if(typeof val=="object"){ //此处在进行模糊匹配
                    flag=flag&&val.test(item[filed]);
                }else{
                    flag=flag&&item[filed]==val;
                }
            }
            return flag;
        })
    },
    //做内存分页
    getPageQuery(currentPage,modules){
        let info={};
        let total=modules.length;
        let pageSize=config.mongo.pageSize;
        let start=pageSize*(currentPage-1);
        let end=currentPage*pageSize;
        end=end>total?total:end;
        info.total=total;
        info.pageSize=currentPage;
        info.models=modules.slice(start,end);
        console.log("内存分页模式...");
        return info;
    },
    //记录排重  默认按照uuid 排重
    getNoRepeatQuery(modules,filed){
        let map={};
        let ary=[];
        // let identify="uuid";
        let identify=filed||"uuid";
        modules.forEach((module)=>{
            if(map[module[identify]]==null){
                ary.push(module);
                map[module[identify]]=module[identify];

            }
        })
        map=null;
        return ary;
    },

}

module.exports=query;


