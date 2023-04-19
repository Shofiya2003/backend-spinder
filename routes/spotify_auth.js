const express = require('express');
const router = express.Router();

const spotify = require('../utils/spotify/spotify');

//token storage db
const TokenStorage = require('../models/token');

spotify.seed();

router.get('/', async (req, res) => {
    try {

        console.log("generating consent screen url");
        const consentScreenUrl = spotify.generateUrl();
        console.log(consentScreenUrl);
        return res.redirect(consentScreenUrl);

    } catch (err) {
        console.log("error in athuenticating spotify");
        return res.json({ msg: "something went wrong in spotify authentication" });
    }

})

//callback url
router.get('/callback', spotify.exchangeCode, async (req, res) => {

    try {
        console.log("got the tokens");
        console.log(req.access_token);

        //store the tokens in the object
        spotify.setAccessToken(req.access_token);
        spotify.setRefreshToken(req.refresh_token);

        //get the user details from spotify
        const user = await spotify.getUserDetails(req.access_token);
        const { email, display_name: username, country, id: spotifyId, uri: spotifyUri } = user

        const data = {
            spotifyId: spotifyId,
            username: username
        }
        if (email) {
            data.email = email;
        }
        if (country) {
            data.country = country;
        }

        const uri = spotifyUri.split(":")[2];
        data.spotifyUri = uri;
        console.log(`extracted uri ${uri}`)

        //check if user is already registered

        //if registered move ahead

        //if not registerd create a user and find the recently played


        // const newTokens = new TokenStorage({
        //     accessToken: req.access_token,
        //     refreshToken: req.refresh_token
        // });

        // await newTokens.save();

        // console.log("synced model with database");

        res.json({ msg: "successfully logged in with spotify" })
    } catch (err) {
        console.log(err);
        console.log(`error in spotify.js callback function: ${err.msg}`);
        res.json({ msg: "something went wrong" });
    }

})

module.exports = router;