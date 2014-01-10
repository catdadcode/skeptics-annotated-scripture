var fs = require('fs'),
    file = __dirname + '/jsonfiles/annotations.json',
    simpledb = require('mongoose-simpledb');

// Initialize simpledb.
simpledb.init({ connectionString: 'mongodb://localhost/sas' }, function (err, db) {
    if (err) return console.error(err);
    db.Category.find({}, function (err, categories) {
        if (err) return console.error(err);
        categories.forEach(function (category) {
            category.urlName = category.name.toLowerCase().replace(/ /g, '-');
            category.save(function (err) {
                if (err) return console.error(err);
            });
        });
    });
}); // Initialize simpledb.

