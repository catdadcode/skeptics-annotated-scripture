var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    username: String,
    password: String,
    email: String,
    joinDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    role: { type: ObjectId, ref: 'Role' }
};