var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    text: String,
    categories: [{ type: ObjectId, ref: 'Category' }],
    verses: [{ type: ObjectId, ref: 'Verse' }]
};
