const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
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
        required: function() {
            return !this.googleId; // Password required only if not using Google Auth
        }
    },
    googleId: {
        type: String
    },
    avatar: {
        type: String
    },
    streak: {
        type: Number,
        default: 0
    },
    lastCompletedDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
