const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    classId: {
        type: String,
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
    grade: [],
}, { timestamps: true });

module.exports = mongoose.model('component', ComponentSchema);


