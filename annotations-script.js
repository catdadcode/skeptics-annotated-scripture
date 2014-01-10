var fs = require('fs'),
    file = __dirname + '/jsonfiles/annotations.json',
    simpledb = require('mongoose-simpledb');

// Initialize simpledb.
simpledb.init({ connectionString: 'mongodb://localhost/sas' }, function (err, db) {
    if (err) return console.error(err);

    // Read JSON file from disk.
    console.log('Reading JSON data...');
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) return console.error(err);
        console.log('Done. No errors.');

        // Parse JSON into usable JavaScript.
        console.log('Parsing JSON...');
        var jsonArray = JSON.parse(data);
        console.log('Done. No errors.');

        var newArray = [];
        jsonArray.forEach(function (jsonItem) {
            if (jsonItem.type === 'contra') return;
            var exists = false;
            newArray.forEach(function (item) {
                if (item.comment === jsonItem.comment)
                    exists = true;
            });
            if (!exists) newArray.push(jsonItem);
        });

        console.log(newArray.length);
        return;

        // Map category abbreviations to full category name.
        var categoryMappings = {
            'boring': "Boring Stuff",
            'abs': "Absurdity",
            'inj': "Injustice",
            'cruelty': "Cruelty and Violence",
            'int': "Intolerance",
            'good': "Good Stuff",
            'fv': "Family Values",
            'women': "Misogyny",
            'science': "Science and History",
            'sex': "Sex",
            'proph': "Prophecy",
            'lang': "Language",
            'gay': "Homosexuality",
            'interp': "Interpretation",
            'contra': "Contradictions"
        };

        var addedAnnotations = [];

        // Iterate over JSON array.
        jsonArray.forEach(function (jsonItem) {

            // Ignore contradiction annotations. They will be added at another time in another way.
            if (jsonItem.type === 'contra') return;

            try {

                var linkText = jsonItem.linkText,
                    chapterNumber = jsonItem.chapterNr,
                    bookName = jsonItem.book,
                    text = jsonItem.comment,
                    categoryName = categoryMappings[jsonItem.type],
                    verseNumbers = [];

                // Skip any chapter-level annotations. We'll figure out another solution for those later.
                if (linkText.match(/chapters/i)) return;

                // Remove all whitespace, newlines, and alpha characters.
                linkText = linkText.replace(/[a-z]\.?|\s/g, '');

                // Replace dot characters in verses with range identifier.
                linkText = linkText.replace(/\./g, '-');

                // Replace semi-colons with colons.
                linkText = linkText.replace(/;/g, ':');

                // If linkText has more than one colon then the annotation spans chapters. Not allowed. Skip for now.
                if ((linkText.match(/:/g) || []).length > 1) return;

                // If colon exists then trim up to colon.
                var hasColon = linkText.indexOf(':') !== -1;
                if (hasColon) linkText = linkText.split(':')[1];
                
                // Create function to resolve verse ranges.
                function resolveRanges(linkText) {
                    var hasHyphen = linkText.indexOf('-') !== -1;
                    if (hasHyphen) {
                        var segments = linkText.split('-'),
                            rangeStart = parseInt(segments[0]),
                            rangeEnd = parseInt(segments[1]);

                        // If start is greater than end then swap them.
                        if (rangeStart > rangeEnd) {
                            rangeStart = parseInt(segments[1]);
                            rangeEnd = parseInt(segments[0]);
                        }

                        for (var count = rangeStart; count < rangeEnd + 1; count++)
                            verseNumbers.push(parseInt(count));
                    } else
                        verseNumbers.push(parseInt(linkText));
                }

                // Split linkText by commas and pass each segment to resolveRanges. If no commas then just pass whole linkText to resolveRanges.
                var hasComma = linkText.indexOf(',') !== -1;
                if (hasComma) {
                    var segments = linkText.split(',');
                    segments.forEach(resolveRanges);
                } else resolveRanges(linkText);

                db.Verse.find({
                    index: {
                        $in: verseNumbers
                    },
                    chapterNumber: chapterNumber,
                    bookName: bookName
                }, function (err, verses) {
                    if (err) return console.error(err);
                    db.Category.findOne({ name: categoryName }, function (err, category) {
                        if (err) return console.error(err);
                        if (!category) return console.error('No category called "' + categoryName + '".');
                        var annotation;
                        addedAnnotations.forEach(function (addedAnnotation) {
                            if (addedAnnotation.text === text)
                                annotation = addedAnnotation;
                        });
                        if (annotation) {
                            annotation.categories.push(category);
                            annotation.save(function (err) {
                                if (err) return console.error(err);
                                console.log("UPDATED annotation for: " + bookName + " " + chapterNumber + ":", verseNumbers);
                            });
                        }
                        else {
                            annotation = new db.Annotation({
                                text: text,
                                categories: [category],
                                verses: verses
                            });
                            addedAnnotations.push(annotation);
                            console.log("SAVING annotation for: " + bookName + " " + chapterNumber + ":", verseNumbers);
                            annotation.save(function (err) {
                                if (err) return console.error(err);
                                console.log("SAVED annotation for: " + bookName + " " + chapterNumber + ":", verseNumbers);
                            });
                        }
                    }); 
                });

            } catch (err) {
                console.error(err);
                console.error(jsonItem);
            }
        }); // Iterate JSON array.

    }); // Read file from disk.

}); // Initialize simpledb.
