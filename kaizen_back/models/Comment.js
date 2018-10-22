let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Comment = Schema({
    _id: Schema.Types.ObjectId,
    content: String,
    user: {type: Schema.Types.ObjectId, ref: 'user'}
}, {
    collections: 'comments'
});

module.exports = mongoose.model('comment', Comment);