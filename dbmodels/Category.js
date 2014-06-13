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
                name: doc.urlName,
                icon: 'images/category-icons/' + doc.icon
            };
            callback(null, json);
        } else {
            var json = {
                expandedName: doc.name,
                name: doc.urlName,
                icon: doc.icon,
                description: doc.description
            };
            callback(null, json);
        }
    }
};
