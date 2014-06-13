var db = require('mongoose-simpledb').db;
var async = require('async');

// Get all scripture tomes from the db.
module.exports = function (req, res) {
    db.Tome.find(function (err, tomes) {
        if (err) return console.error(err);
        var simplifyTomes = [];
        tomes.forEach(function (tome) {
            simplifyTomes.push(function (cb) {
                tome.simplify(false, cb);
            });
        });
        async.parallel(simplifyTomes, function (err, tomes) {
            if (err) return console.error(err);
            res.send(tomes);
        });
    });
};
