exports.schema = {
    name: String,
    urlName: String,
    icon: String,
    description: String
};

exports.methods = {
    simplify: function (short, callback) {
        var doc = this;
        if (short) {
            var json = {
                urlName: doc.urlName,
                icon: doc.icon
            };
            callback(null, json);
        } else {
            var json = {
                name: doc.name,
                urlName: doc.urlName,
                icon: doc.icon,
                description: doc.description
            };
            callback(null, json);
        }
    }
};
