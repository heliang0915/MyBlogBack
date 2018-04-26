
let query={

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
    }
}

module.exports=query;


