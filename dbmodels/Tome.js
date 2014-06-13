exports.schema = {
    index: Number,
    name: String,
    urlName: String
};

exports.methods = {
    simplify: function (short, callback) {
        var doc = this;
        if (short) {
            var json = {
                name: doc.urlName
            };
            callback(null, json);
        } else {
            var json = {
                name: doc.urlName,
                expandedName: doc.name
            };
            callback(null, json);
        }
    }
};
