
const express = require('express');
const router = express.Router();
const auth = require('../routes/spotify_auth')
router.use('/spotify', auth)
router.get('/', (req, res) => {
    res.send("we are logically blessed");
});

module.exports = router;