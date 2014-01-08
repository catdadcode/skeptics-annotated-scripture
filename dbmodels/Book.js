var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    name: String,
    index: Number,
    tome: { type: ObjectId, ref: 'Tome' }
};