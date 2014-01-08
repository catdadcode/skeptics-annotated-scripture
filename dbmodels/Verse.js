var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    index: Number,
    text: String,
    chapter: { type: ObjectId, ref: 'Verse' }
};