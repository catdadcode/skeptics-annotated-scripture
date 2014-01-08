var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    index: Number,
    description: String,
    book: { type: ObjectId, ref: 'Book' }
};