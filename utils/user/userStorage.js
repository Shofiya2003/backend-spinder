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
}

module.exports = new UserStorage();