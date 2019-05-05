var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var rfs = require('rotating-file-stream')

var indexRouter = require('./routes/index');
var pagePreview = require('./routes/pagePreview');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = rfs('pdfgenerator.log', {
  interval: '1d', // rotate daily
  path    : logDirectory
});*/
//
//app.use(logger('common', {stream: accessLogStream}))

app.use('/', indexRouter);
app.use('/pdf', pagePreview);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
