var express = require('express');
var router = express.Router();
var db = require('mongoose-simpledb').db;

// Get all scripture tomes from the db.
app.get('/api/sas/tomes', function (req, res) {
    db.Tome.find(function (err, tomes) {
        if (err) return console.error(err);
        res.send(tomes);
    });
});

// Get all books in the specified tome.
app.get('/api/sas/:tomeName/books', function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-');
    db.Book.find({ tomeName: tomeName }, function (err, books) {
        if (err) return console.error(err);
        res.send(books);
    });
});

// Get all chapters in the specified tome & book.
app.get('/api/sas/:tomeName/:bookName/chapters', function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-'),
        bookName = req.param('bookName').toLowerCase().replace(/ /g, '-');

    db.Chapter.find({ tomeName: tomeName, bookName: bookName }, function (err, chapters) {
       if (err) return console.error(err);
      res.send(chapters);
    });
}); 

app.get(/^\/api\/(?:category|categories)\/?(.+)?$/i, function (req, res) {
    console.log(req.params[0]);
    var categoryName = req.params[0];
    if (categoryName) {
        categoryName = categoryName.toLowerCase().replace(/ /g, '-');
        db.Category.findOne({ urlName: categoryName }, function (err, category) {
            if (err) return console.error(err);
            if (category) res.send(category);
            else res.send("No categories called \"" + categoryName + "\".");
        });
    } else
        db.Category.find({}, function (err, categories) {
            if (err) return console.error(err);
            res.send(categories);
        });
});

// Get the specified category.
app.get('/api/category/:categoryName', function (req, res) {
    var categoryName = req.param('categoryName').toLowerCase().replace(/ /g, '-');
    db.Category.findOne({ urlName: categoryName }, function (err, category) {
        if (err) return console.error(err);
        res.send(category);
    });
});

// Get all categories.
app.get('/api/categories', function (req, res) {
    db.Category.find({}, function (err, categories) {
        if (err) return console.error(err);
        res.send(categories);
    });
});

app.get('/api/sas/:tomeName/:bookName?/:verseSyntax?', function (req, res) {
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-'),
        bookName = req.param('bookName'),
        verseSyntax = req.param('verseSyntax'),
        chapterNumber,
        query = { tomeName: tomeName };

    if (bookName) {
        bookName = bookName.toLowerCase().replace(/ /g, '-');
        query.bookName = bookName;
        if (verseSyntax) {
            verseSyntax = verseSyntax.replace(/ /g, '');

            if (verseSyntax.indexOf(':') !== -1) {
                // Parse verse syntax.
                var segments = verseSyntax.split(':'),
                    verseList = segments[1],
                    verseNumbers = [];

                chapterNumber = parseInt(segments[0]);

                function resolveRange(verseRange) {
                    if (verseRange.indexOf('-') !== -1) {
                        var segments = verseRange.split('-'),
                            rangeStart = parseInt(segments[0]),
                            rangeEnd = parseInt(segments[1]);
                        for (var count = rangeStart; count < rangeEnd + 1; count++)
                            verseNumbers.push(count);
                    } else
                        verseNumbers.push(parseInt(verseRange));
                }

                if (verseList.indexOf(',') !== -1)
                    verseList.split(',').forEach(resolveRange);
                else
                    resolveRange(verseList);

                query.index = { $in: verseNumbers };
            } else
                chapterNumber = parseInt(verseSyntax);

            query.chapterNumber = chapterNumber;
        }
    }

    // Get verse(s).
    db.Verse.find(query, function (err, verses) {
        if (err) return console.error(err);
        if (verses.length > 0)
            res.send(verses);
        else
            res.send("No verses found.");
    });
});

module.exports = router;
