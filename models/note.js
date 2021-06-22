const mongoose = require('mongoose');

const NotetSchema = new mongoose.Schema({
    studentId: {
        type: String,
        trim: true,
        required: false,
    },
    classId: {
        type: String,
        trim: true,
        required: false
    },
    description: {
        type: String,
        trim: true,
        required: false,
    },
    date: {
        type: String,
        trim: true,
        required: false,
        default: new Date().toLocaleDateString()
    },
}, { timestamps: true });

module.exports = mongoose.model('note', NotetSchema);


