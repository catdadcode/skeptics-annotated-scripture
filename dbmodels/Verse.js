var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    index: Number,
    text: String,
    chapter: { type: ObjectId, ref: 'Chapter' },
    chapterNumber: Number,
    book: { type: ObjectId, ref: 'Book' },
    bookName: String,
    tome: { type: ObjectId, ref: 'Tome' },
    tomeName: String
};

exports.methods = {
    simplify: function (short, callback) {
        console.log(arguments);
        var doc = this;
        if (short) {
            var json = {
                tomeName: doc.tomeName,
                bookName: doc.bookName,
                chapterNumber: doc.chapterNumber,
                verseNumber: doc.index
            };
            callback(null, json);
        } else {
            var json = {
                text: doc.text,
                tomeName: doc.tomeName,
                bookName: doc.bookName,
                chapterNumber: doc.chapterNumber,
                verseNumber: doc.index
            };
            callback(null, json);
        }
    }
};
