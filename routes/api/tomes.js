var db = require('mongoose-simpledb').db;

// Get all scripture tomes from the db.
module.exports = function (req, res) {
    db.Tome.find(function (err, tomes) {
        if (err) return console.error(err);
        res.send(tomes);
    });
};
