const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {  // changed from name to username
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: { // changed from phone to phoneNumber
        type: String
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
});

module.exports = mongoose.model('User', userSchema);
