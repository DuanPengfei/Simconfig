'use strict';

/**
 * Build in modules
 */
const path = require('path');

/**
 * Third part modules
 */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');

/**
 * Router modules
 */
const indexRouter = require('./routes/index');

const app = express();

/**
 * Use middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

/**
 * Use routers
 */
app.use('/', indexRouter);

/**
 * Error handlers
 */
app.use(function (err, req, res, next) {
    if (!err) {
        const err = new Error('Not Found');
        err.status = 404;
    }
    return res.status(err.status || err.code || 500).send(err.message || 'Internal Server Error');
});

module.exports = app;
