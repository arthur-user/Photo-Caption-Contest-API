const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

const userRouter = require('./routes/users');
const photoRouter = require('./routes/photos');
const captionRouter = require('./routes/captions');
const indexRouter = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/photos', photoRouter);
app.use('/captions', captionRouter);

// catches 404 error and sends it to the error handler
app.use(function(req, res, next) {
    next(createError(404));
})

// error handler

app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page

    res.status(err.status || 500);
    res.render('error');
});

if (!config.privateKey) {
    console.error("FATAL ERROR: privateKey is not defined.");
    process.exit(1);
}

module.exports = app;