const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: [true, 'Please add a booking date']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add an user name']
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: [true, 'Please add a campground name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);