let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Ticket = new Schema({
    ticket: {
        _id: Schema.Types.ObjectId,
        title: String,
        description: String,
        time: Number,
        status: String,
        importance: String,
        urgency: String,
        lasting_effect: String,
        labels: [{type: Schema.Types.ObjectId, ref: 'label'}],
        owner: {type: Schema.Types.ObjectId, ref: 'user'}
    },
}, {
    collection: 'tickets'
});

module.exports = mongoose.model('ticket', Ticket);