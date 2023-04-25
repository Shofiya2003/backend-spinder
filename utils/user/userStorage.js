const User = require('../../models/user')

class UserStorage {
    async findUser(query) {
        try {
            const user = await User.findOne(query);
            return user;
        } catch (err) {
            console.log(err)
            throw new Error(err.message);
        }
    }

    async createUser(newUser) {
        try {
            const user = new User(newUser);
            await user.save();
        } catch (err) {
            console.log(err);
        }

    }

    async updateUser(spotifyId, data) {
        try {
            const user = await User.findOneAndUpdate({ spotifyId: spotifyId }, data);
            
        } catch (err) {
            console.log(err);
            throw new Error(err.message)
        }
    }
}

module.exports = new UserStorage();