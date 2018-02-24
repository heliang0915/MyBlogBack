var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyBlog数据系统' });
});


module.exports = router;
