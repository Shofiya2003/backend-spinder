const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['Authorization'];
        if (!token) {
            return res.json({ status: "error", msg: "jwt token missing" });
        }
        if (!jwt.verify(token, process.env.JWT_SECRET)) {
            return res.json({ status: "error", msg: "invalid jwt token" });
        }
        const data = jwt.decode(token);
        console.log(data);
        res.spotifyId = data.spotifyId;
        next();
    } catch (err) {
        console.log(err);
        return res.json({ status: "error", msg: "error verifying jwt token" });
    }
}

module.exports = authMiddleware;