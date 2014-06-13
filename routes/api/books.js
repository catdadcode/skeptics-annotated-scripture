var db = require('mongoose-simpledb').db;
var async = require('async');

// Get all books in the specified tome.
module.exports = function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-');
    db.Book.find({ tomeName: tomeName }, function (err, books) {
        if (err) return console.error(err);
        var simplifyBooks = [];
        books.forEach(function (book) {
            simplifyBooks.push(function (cb) {
                book.simplify(false, cb);
            });
        });
        async.parallel(simplifyBooks, function (err, books) {
            if (err) return console.error(err);
            res.send(books);
        });
    });
};
