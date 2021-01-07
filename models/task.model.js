const mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: 'This field is required.'
    },
    Deadline: {
        type: String
    },
    TimeRequired: {
        type: String
    }
});

mongoose.model('Task', taskSchema);