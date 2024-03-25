const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please add a review']
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: [true, 'Please add a campground name']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add an user name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
