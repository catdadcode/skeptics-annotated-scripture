var db = require('mongoose-simpledb').db;

// Get all categories.
module.exports = function (req, res) {
    db.Category.find({}, function (err, categories) {
        if (err) return console.error(err);
        res.send(categories);
    });
};
