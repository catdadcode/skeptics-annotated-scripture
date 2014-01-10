var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    index: Number,
    text: String,
    chapter: { type: ObjectId, ref: 'Verse' },
    chapterNumber: Number,
    book: { type: ObjectId, ref: 'Book' },
    bookName: String,
    tome: { type: ObjectId, ref: 'Tome' },
    tomeName: String
};
