var fs = require('fs'),
    file = __dirname + '/jsonfiles/annotations.json',
    simpledb = require('mongoose-simpledb');

// Initialize simpledb.
simpledb.init({ connectionString: 'mongodb://localhost/sas' }, function (err, db) {
    if (err) return console.error(err);
    db.Chapter.find(function (err, chapters) {
        if (err) return console.error(err);
        chapters.forEach(function (chapter) {
            chapter.bookName = chapter.bookName.toLowerCase().replace(/ /g, '-');
            chapter.save(function (err) {
                if (err) return console.error(err);
            });
        });
    });
}); // Initialize simpledb.

