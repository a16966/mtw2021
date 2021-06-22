const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    course: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: Number,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('class', ClassSchema);