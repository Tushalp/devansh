const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // trim: true, 
        index: true
    },
    email: {
        type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 8 characters long']
    }
});

module.exports = mongoose.model('User', userSchema);
