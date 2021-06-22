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
}, { timestamps: true });

module.exports = mongoose.model('note', NotetSchema);


