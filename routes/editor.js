/**
 * 编辑器
 * User: heliang
 * Date: 2017/12/18.
 */
var  express= require('express') ;
var router = express.Router();

var BaseURL = "/umeditor/";
var editorConfig= {
    //为编辑器实例添加一个路径，这个不能被注释
    UMEDITOR_HOME_URL: BaseURL,
    imageUrl: "/editor/uploadEditor",//图片上传提交地址
    imagePath: "/upload/images/", //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
    imageFieldName: "upfile",
};


router.get("/getConfig",function (req,res){
    res.send(editorConfig);
})


module.exports = router;
