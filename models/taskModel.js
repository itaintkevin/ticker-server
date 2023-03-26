const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    subTask: {
        type: [String],
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema)