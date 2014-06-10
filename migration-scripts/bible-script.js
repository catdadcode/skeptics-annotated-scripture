var fs = require('fs'),
    file = __dirname + '/jsonfiles/verses.json',
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

        // Map abbreviations to full book names.
        var bookMappings = {
            'gen': 'Genesis',
            'ex': 'Exodus',
            'lev': 'Leviticus',
            'num': 'Numbers',
            'dt': 'Deuteronomy',
            'jos': 'Joshua',
            'jg': 'Judges',
            'ru': 'Ruth',
            '1sam': '1 Samuel',
            '2sam': '2 Samuel',
            '1kg': '1 Kings',
            '2kg': '2 Kings',
            '1chr': '1 Chronicles',
            '2chr': '2 Chronicles',
            'ezra': 'Ezra',
            'neh': 'Nehemiah',
            'est': 'Esther',
            'job': 'Job',
            'ps': 'Psalms',
            'pr': 'Proverbs',
            'ec': 'Ecclesiastes',
            'sofs': 'Song of Songs',
            'is': 'Isaiah',
            'jer': 'Jeremiah',
            'lam': 'Lamentations',
            'ezek': 'Ezekiel',
            'dan': 'Daniel',
            'hos': 'Hosea',
            'jl': 'Joel',
            'am': 'Amos',
            'ob': 'Obadiah',
            'jon': 'Jonah',
            'mic': 'Micah',
            'nah': 'Nahum',
            'hab': 'Habakkuk',
            'zeph': 'Zephaniah',
            'hag': 'Haggai',
            'zech': 'Zechariah',
            'mal': 'Malachi',
            'mt': 'Matthew',
            'mk': 'Mark',
            'lk': 'Luke',
            'jn': 'John',
            'acts': 'Acts',
            'rom': 'Romans',
            '1cor': '1 Corinthians',
            '2cor': '2 Corinthians',
            'gal': 'Galatians',
            'eph': 'Ephesians',
            'phil': 'Philippians',
            'col': 'Colossians',
            '1th': '1 Thessalonians',
            '2th': '2 Thessalonians',
            '1tim': '1 Timothy',
            '2tim': '2 Timothy',
            'tit': 'Titus',
            'philem': 'Philemon',
            'heb': 'Hebrews',
            'jas': 'James',
            '1pet': '1 Peter',
            '2pet': '2 Peter',
            '1jn': '1 John',
            '2jn': '2 John',
            '3jn': '3 John',
            'jude': 'Jude',
            'rev': 'Revelation'
        };

        // Get bible tome model.
        console.log("Retrieving King James Bible...");
        db.Tome.findOne({ index: 0 }, function (err, bible) {
            if (err) return console.error(err);
            console.log('Done. No errors.');

            // Setup arrays to track existing items.
            var existingBooks = [],
                existingChapters = [],
                book,
                chapter,
                verseCount = 0;

            // Iterate over JSON array.
            console.log('Iterating over JSON array...');
            jsonArray.forEach(function (jsonItem) {
                verseCount++;

                // Get book name from mappings and check if it has been added already.
                var bookName = bookMappings[jsonItem.book],
                    bookExists = false;
                existingBooks.forEach(function (existingBookName) {
                    if (existingBookName === bookName) bookExists = true;
                });

                // If book does not exist, insert it and mark it as existing.
                if (!bookExists) {
                    console.log("Inserting book: " + bookName);
                    existingBooks.push(bookName);
                    book = new db.Book({
                        index: jsonItem.bookNr,
                        name: bookName,
                        urlName: bookName.toLowerCase().replace(/ /g, '-'),
                        tome: bible
                    });
                    book.save(function (err) {
                        if (err) return console.error(err);
                    });
                }
                
                // Check if chapter has been added already.
                var chapterExists = false;
                existingChapters.forEach(function (existingChapter) {
                   if ((bookName + "|" + jsonItem.chapterNr) === existingChapter) chapterExists = true;
                });

                //If chapter does not exist, insert it and mark it as existing.
                if (!chapterExists) { 
                    console.log("Inserting chapter: " + bookName + " " + jsonItem.chapterNr);
                    existingChapters.push(bookName + "|" + jsonItem.chapterNr);
                    chapter = new db.Chapter({
                        index: jsonItem.chapterNr,
                        book: book,
                        bookName: bookName
                    });
                    chapter.save(function (err) {
                        if (err) return console.error(err);
                    });
                }

                // Insert verse.
                console.log(verseCount + ") Inserting verse: " + bookName + " " + jsonItem.chapterNr + ":" + jsonItem.verseNr);
                var verse = new db.Verse({
                    index: jsonItem.verseNr,
                    text: jsonItem.verseText,
                    chapter: chapter,
                    chapterNumber: jsonItem.chapterNr,
                    book: book,
                    bookName: bookName
                });
                verse.save(function (err) {
                    if (err) return console.error(err);
                });

            }); // Iterate JSON array

        }); // Find bible.

    }); // Read file from disk.

}); // Initialize simpledb.


