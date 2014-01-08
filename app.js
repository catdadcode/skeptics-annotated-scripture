
/**
 * Module dependencies.
 */

var express = require('express');
var nib = require('nib');
var stylus = require('stylus');
var http = require('http');
var path = require('path');
var simpledb = require('mongoose-simpledb');

var app = express();

simpledb.init(process.env.CONNECTION_STRING, function (err, db) {
    if (err) return console.error(err);

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('as;lfja;lsdfhoau1392481092alsdfjasj'));
    app.use(express.session());
    app.use(stylus.middleware({
        src: path.join(__dirname, 'public'),
        compile: function (str, path) {
            return stylus(str).set('filename', path).use(nib());
        }
    }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    app.get('/', function (req, res) {
        res.render('index', { title: 'Express' });
    });

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });

});
