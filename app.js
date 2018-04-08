var express = require('express');
var path = require('path');
var logger = require('morgan');
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
// var https = require('https');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
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



// app.use('/',function(req, res, next){
//     res.send("BLOGAPI");
// });
// catch 404 and forward to error handler


// app.use(function(req, res, next) {
//   // var err = new Error('Not Found');
//   // err.status = 404;
//   // next(err);
//     res.status(err.status || 404);
//     res.json({
//         message: err.message,
//         error: err
//     });
//     next(err);
// });


// app.use(function(err, req, res, next) {
//     if (err.code === 404){
//         res.status(404).end('Not Found')
//     }else{
//         // res.status(err.status || 500).end("Internal Server Error "+err.stack)
//         // fs.readFile(path.join(__dirname,"/page/500.html"),(er,content)=>{
//         //     res.status(err.status || 500).end(content.toString());
//         // })
//         res.status(err.status || 500).end(content.toString());
//     }
//     // fileLog.error(err.stack);
// });


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
