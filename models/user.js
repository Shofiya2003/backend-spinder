const mongoose = require("mongoose");

const user = new mongoose.Schema({
    email: {
        type: String
    },
    username: {
        type: String
    },
    country: {
        type: String
    },
    spotifyId: {
        type: String,
        required: true
    },
    artistScore: {
        type: Map,
        required: true
    },
    profilePicture: {
        type: String
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('user', user);