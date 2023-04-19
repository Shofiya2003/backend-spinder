const mongoose = require("mongoose");

const tokenStorage = new mongoose.Schema({
    spotifyUri: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('token', tokenStorage);