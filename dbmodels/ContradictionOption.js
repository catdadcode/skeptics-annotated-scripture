var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    answer: String,
    text: String,
    contradiction: { type: ObjectId, ref: 'Contradiction' }
};