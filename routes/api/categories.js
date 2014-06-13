var db = require('mongoose-simpledb').db;
var async = require('async');

// Get all categories.
module.exports = function (req, res) {
    db.Category.find({}, function (err, categories) {
        if (err) return console.error(err);
        var simplifyCategories = [];
        categories.forEach(function (category) {
            simplifyCategories.push(function (cb) {
                category.simplify(false, cb);
            });
        });
        async.parallel(simplifyCategories, function (err, categories) {
            if (err) return console.error(err);
            res.send(categories);
        });
    });
};
