var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    name: String,
    urlName: String,
    index: Number,
    tome: { type: ObjectId, ref: 'Tome' },
    tomeName: String
};

exports.methods = {
    simplify: function (short, callback) {
        var doc = this;
        if (short) {
            var json = {
                name: doc.urlName,
                tomeName: doc.tomeName
            };
            callback(null, json);
        } else {
            var json = {
                name: doc.urlName,
                expandedName: doc.name,
                tomeName: doc.tomeName
            };
            callback(null, json);
        }
    }
};
