var db = require('mongoose-simpledb').db;

// Get the specified verse or verses.
module.exports = function (req, res) {
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
};
