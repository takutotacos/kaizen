let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Label = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    tickets: [{type: Schema.Types.ObjectId, ref: 'ticket'}]
}, {
    collection: 'labels'
});

module.exports = mongoose.model('label', Label);