
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

simpledb.init(process.env.CONNECTION_STRING || "mongodb://localhost/sas", function (err, db) {
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

    app.get('/sas/:tomeName/:bookName?/:verseSyntax?', function (req, res) {
        var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-'),
            bookName = req.param('bookName'),
            verseSyntax = req.param('verseSyntax'),
            chapterNumber,
            query = { tomeName: tomeName };

        if (bookName) {
            bookName = bookName.toLowerCase().replace(/ /g, '-');
            query.bookName = bookName;
            if (verseSyntax) {
                verseSyntax = verseSyntax.replace(/ /g, '');

                if (verseSyntax.indexOf(':') !== -1) {
                    // Parse verse syntax.
                    var segments = verseSyntax.split(':'),
                        verseList = segments[1],
                        verseNumbers = [];

                    chapterNumber = parseInt(segments[0]);

                    function resolveRange(verseRange) {
                        if (verseRange.indexOf('-') !== -1) {
                            var segments = verseRange.split('-'),
                                rangeStart = parseInt(segments[0]),
                                rangeEnd = parseInt(segments[1]);
                            for (var count = rangeStart; count < rangeEnd + 1; count++)
                                verseNumbers.push(count);
                        } else
                            verseNumbers.push(parseInt(verseRange));
                    }

                    if (verseList.indexOf(',') !== -1)
                        verseList.split(',').forEach(resolveRange);
                    else
                        resolveRange(verseList);

                    query.index = { $in: verseNumbers };
                } else
                    chapterNumber = parseInt(verseSyntax);

                query.chapterNumber = chapterNumber;
            }
        }


        // Get verse(s).
        db.Verse.find(query, function (err, verses) {
            if (err) return console.error(err);
            console.log(tomeName + " - " + bookName + " " + chapterNumber + ":", verseNumbers); 
            if (verses.length > 0)
                res.send(verses);
            else
                res.send("No verses found.");
        });
    });

    app.get(/^\/(?:category|categories)\/?(.+)?$/i, function (req, res) {
        console.log(req.params[0]);
        var categoryName = req.params[0];
        if (categoryName) {
            categoryName = categoryName.toLowerCase().replace(/ /g, '-');
            db.Category.findOne({ urlName: categoryName }, function (err, category) {
                if (err) return console.error(err);
                if (category) res.send(category);
                else res.send("No categories called \"" + categoryName + "\".");
            });
        } else
            db.Category.find({}, function (err, categories) {
                if (err) return console.error(err);
                res.send(categories);
            });
    });

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });

});
