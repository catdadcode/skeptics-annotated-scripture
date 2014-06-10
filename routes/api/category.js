var db = require('mongoose-simpledb').db;

// Get the specified category.
module.exports = function (req, res) {
    var categoryName = req.param('categoryName').toLowerCase().replace(/ /g, '-');
    db.Category.findOne({ urlName: categoryName }, function (err, category) {
        if (err) return console.error(err);
        res.send(category);
    });
};
