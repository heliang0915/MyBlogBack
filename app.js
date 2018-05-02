var express = require('express');
var path = require('path');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var channel = require('./routes/channel');
var editor = require('./routes/editor');
var article = require('./routes/article');
var index = require('./routes/index');
var user = require('./routes/user');
var menu = require('./routes/menu');
var role = require('./routes/role');
var right = require('./routes/right');
var comment = require('./routes/comment');
var wx = require('./routes/wx');

var app = express();
var loginFilter=[''];
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/', index);
app.use('/channel', channel);
app.use('/editor', editor);
app.use('/article', article);
app.use('/user', user);
app.use('/menu', menu);
app.use('/right', right);
app.use('/role', role);
app.use('/comment', comment);
app.use('/wx', wx);
console.log("tag2");
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  err==null?null:console.log(err)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
