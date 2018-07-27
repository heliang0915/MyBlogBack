// let test=require('jest');
//

let fetch = require('../util/fetch');

function getList() {
  return new Promise(function(resolve, reject) {
      fetch(`http://localhost:8080/web/blogList`, {
      // fetch(`https://www.blogapi.top/web/blogList`, {
      page: 1,
      pageSize: 7,
      params: {
        title: "",
        search_field: 'zan',
        tag: '6d0a767bb53643e39aec30530de0fc56'
      }
    }).then(function(resp, err) {
      // res.send(resp);
      var data = resp.data.data;
      // console.log("data:::::::::" + data);
          resolve(data)

    });
  });


}



function loop() {
  let startTime=Date.now();
  getList().then(()=>{
    let endTime=Date.now();
    console.log("耗时:::::"+(endTime-startTime)+"ms");
  })
}


setInterval(()=>{
  loop();
},4000)



// test('getBlogList', async () => {
//   console.log('运行测试用例...');
//   // expect.assertions(1);
//   // const data = await getList();
//   // await expect(getList());
//   // try {
//    // await getList();
//    // await expect(getList()).resolves.toBe(Object);
//  // } catch (e) {
//  //   expect(e).toMatch('error');
//  // }
// });
