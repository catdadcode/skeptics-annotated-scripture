var db = require('mongoose-simpledb').db;
var async = require('async');

/*
 * The following example URLs all match this handler:
 *
 * /api/king-james-bible
 * /api/king-james-bible/exodus
 * /api/king-james-bible/exodus/21
 * /api/king-james-bible/exodus/21:20
 * /api/king-james-bible/exodus/21:20,25
 * /api/king-james-bible/exodus/21:20-23
 * /api/king-james-bible/exodus/21:20-23,25
 * /api/king-james-bible/exodus/21:20-23,25-27,30
 *
 * All verses that match the query are returned, as well as any associated annotations.
 *
 */

// Get the specified verse or verses.
module.exports = function (req, res) {

    // Get reference to URL data.
    var tomeName = req.param('tomeName').toLowerCase().replace(/ /g, '-'),
        bookName = req.param('bookName'),
        verseSyntax = req.param('verseSyntax'),
        chapterNumber,
        // Begin a mongoose query.
        query = { tomeName: tomeName };

    // If a book was specified then limit our query futher.
    if (bookName) {

        // Normalize the book name.
        bookName = bookName.toLowerCase().replace(/ /g, '-');
        // Add the book name to our query.
        query.bookName = bookName;

        // If a verse string was specified then limit our query even further.
        if (verseSyntax) {

            // Normalize the verse string.
            verseSyntax = verseSyntax.replace(/ /g, '');

            // If the verse string contains a colon then assume a verse has been specified in addition to chapter.
            if (verseSyntax.indexOf(':') !== -1) {

                // Parse verse string.
                var segments = verseSyntax.split(':'),
                    verseList = segments[1],
                    verseNumbers = [];

                // Get the chapter number from the verse string, before the colon.
                chapterNumber = parseInt(segments[0]);

                // Declare a function for resolving verse ranges found in the verse string.
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

                // If the verse string contains commas then multiple verses or verse ranges were specified.
                if (verseList.indexOf(',') !== -1)
                    // Split the verses up and run the resolveRange function on each segment.
                    verseList.split(',').forEach(resolveRange);
                else
                    // Only one verse/range was specified so call our resolveRange function once.
                    resolveRange(verseList);

                // Add the verse numbers to our query.
                query.index = { $in: verseNumbers };
            } else
                // No colon means no verses were specified, just grab the whole chapter of verses.
                chapterNumber = parseInt(verseSyntax);

            // Augment our query with the chapter number.
            query.chapterNumber = chapterNumber;
        }
    }

    // Get verse(s).
    db.Verse.find(query, function (err, verses) {
        if (err) return console.error(err);
        db.Annotation.find({ verses: { $in: verses } }, function (err, annotations) {
            if (err) return console.error(err);
            var result = {
                verses: [],
                annotations: []
            };
            // TODO: do same to verses as to annotations.
            if (verses.length > 0)
                result.verses = verses;

            var jobs = [];
            annotations.forEach(function (annotation) {
                jobs.push(function (cb) {
                    annotation.simplify(false, cb);
                });
            });
            async.parallel(jobs, function (err, annotations) {
                if (err) return console.error(err);
                result.annotations = annotations;
                res.send(result);
            });
        });
    });
};
