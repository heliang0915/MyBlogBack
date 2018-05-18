let  ary=[1,2,3,4,5,6];
ary.forEach((item)=>{
    console.log(item);
})

//不可return 便利数组的index 并且是string 类型的 也可便利对象
for(let key in ary){
    console.log(`key>>>${key}`);
}
//可以return 可便利数组 但是不能便利对象
for(let val of ary){
    console.log(`key>>>${val}`);

     
}