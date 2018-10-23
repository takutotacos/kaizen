let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Ticket = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    time: Number,
    status: {
        type: String,
        enum: ['Waiting', 'Work In Progress', 'Done'],
        required: true
    },
    importance: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    lasting_effect: String,
    labels: [{type: Schema.Types.ObjectId, ref: 'label'}],
    owner: {type: Schema.Types.ObjectId, ref: 'user'}
}, {
    collection: 'tickets'
});

module.exports = mongoose.model('ticket', Ticket);