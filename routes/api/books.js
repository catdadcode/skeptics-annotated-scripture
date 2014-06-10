var db = require('mongoose-simpledb').db;

// Get all books in the specified tome.
module.exports = function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-');
    db.Book.find({ tomeName: tomeName }, function (err, books) {
        if (err) return console.error(err);
        res.send(books);
    });
};
