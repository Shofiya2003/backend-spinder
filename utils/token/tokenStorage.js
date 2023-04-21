const Token = require('../../models/token');

class TokenStorage {
    async createToken(newToken) {
        try {
            const token = new Token(newToken);
            await token.save();
        } catch (err) {
            console.log(err);
        }
    }

    async getToken(spotifyId) {
        try {
            const token = await Token.findOne({ spotifyId: spotifyId });
            return token;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteToken(spotifyId) {
        try {
            await Token.deleteOne({ spotifyId: spotifyId });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new TokenStorage();