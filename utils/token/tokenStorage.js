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
}

module.exports = new TokenStorage();