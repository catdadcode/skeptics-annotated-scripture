var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    name: String,
    urlName: String,
    index: Number,
    tome: { type: ObjectId, ref: 'Tome' }
};
