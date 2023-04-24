
const express = require('express');
const router = express.Router();
const auth = require('../routes/spotify_auth')
const users = require('../routes/user');
router.use('/spotify', auth)
router.use('/users', users)
router.get('/', (req, res) => {
    res.send("we are logically blessed");
});

module.exports = router;