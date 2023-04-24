const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
    try {
        //if the session does not have the token or the userId delete it 
        if (!req.session.isPopulated || !req?.session?.token || !req?.session?.userId) {
            req.session = null
            return res.json({ status: "error", msg: "user not loggedin" })
        }

        const { token, userId } = req.session;


        if (!token) {
            return res.json({ status: "error", msg: "jwt token missing" });
        }
        if (!jwt.verify(token, process.env.JWT_SECRET)) {
            return res.json({ status: "error", msg: "invalid jwt token" });
        }

        res.spotifyId = spotifyId;
        next();
    } catch (err) {
        console.log(err);
        return res.json({ status: "error", msg: "error verifying jwt token" });
    }
}

module.exports = authMiddleware;