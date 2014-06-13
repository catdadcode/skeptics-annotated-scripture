var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    index: Number,
    description: String,
    book: { type: ObjectId, ref: 'Book' },
    bookName: String,
    tome: { type: ObjectId, ref: 'Tome' },
    tomeName: String
};

exports.methods = {
    simplify: function (short, callback) {
        var doc = this;
        if (short) {
            var json = {
                chapterNumber: doc.index,
                bookName: doc.bookName,
                tomeName: doc.tomeName
            };
            callback(null, json);
        } else {
            var json = {
                chapterNumber: doc.index,
                description: doc.description,
                bookName: doc.bookName,
                tomeName: doc.tomeName
            };
            callback(null, json);
        }
    }
};
