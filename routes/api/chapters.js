var db = require('mongoose-simpledb').db;
var async = require('async');

// Get all chapters in the specified tome & book.
module.exports = function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-'),
        bookName = req.param('bookName').toLowerCase().replace(/ /g, '-');

    db.Chapter.find({ tomeName: tomeName, bookName: bookName }, function (err, chapters) {
       if (err) return console.error(err);
       var simplifyChapters = [];
       chapters.forEach(function (chapter) {
           simplifyChapters.push(function (cb) {
               chapter.simplify(false, cb);
           });
       });
       async.parallel(simplifyChapters, function (err, chapters) {
           if (err) return console.error(err);
           res.send(chapters);
       });
    });
}; 
