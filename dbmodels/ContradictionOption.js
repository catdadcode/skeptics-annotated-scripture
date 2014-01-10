var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    answer: String,
    comments: String,
    contradiction: { type: ObjectId, ref: 'Contradiction' },
    verses: [{ type: ObjectId, ref: 'Verse' }]

};
