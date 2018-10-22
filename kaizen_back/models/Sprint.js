let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Sprint = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    start_date: Date,
    end_date: Date,
    tickets: [{type: Schema.Types.ObjectId, ref:'ticket'}]
}, {
    collection: 'sprints'
});

module.exports = mongoose.model('sprint', Sprint);