var simpledb = require('mongoose-simpledb');
var ObjectId = simpledb.Types.ObjectId;
var db = simpledb.db;
var async = require('async');

exports.schema = {
    text: String,
    categories: [{ type: ObjectId, ref: 'Category' }],
    verses: [{ type: ObjectId, ref: 'Verse' }]
};

exports.methods = {
    simplify: function (short, callback) {
        var doc = this;
        var json = {
            text: doc.text,
            categories: [],
            verses: []
        };
        if (short)
            delete json.text;
        async.parallel({
            categories: function (cb) {
                doc.populate('categories', cb);
            },
            verses: function (cb) {
                doc.populate('verses', cb);
            }
        }, function (err) {
            if (err) return callback(err);

            var resolveRefs = {};

            var makeCategoriesJSON = [];
            doc.categories.forEach(function (category) {
                makeCategoriesJSON.push(function (cb) {
                    json.categories.push(category.simplify(true, cb));
                });
            });
            resolveRefs.categories = function (cb) {
                async.parallel(makeCategoriesJSON, cb);
            };

            var makeVersesJSON = [];
            doc.verses.forEach(function (verse) {
                makeVersesJSON.push(function (cb) {
                    json.verses.push(verse.simplify(true, cb));
                });
            });
            resolveRefs.verses = function (cb) {
                async.parallel(makeVersesJSON, cb);
            };

            async.parallel(resolveRefs, function (err, result) {
                json.categories = result.categories;
                json.verses = result.verses;
                callback(null, json);
            });
        });
    },
};
