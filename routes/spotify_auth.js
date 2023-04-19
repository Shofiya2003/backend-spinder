const express = require('express');
const router = express.Router();

const spotify = require('../utils/spotify/spotify');

//token storage db
const TokenStorage = require('../utils/token/tokenStorage');
const UserStorage = require('../utils/user/userStorage')

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
        const { email, display_name: username, country, id: spotifyId } = user


        console.log(`spotify id ${spotifyId}`)

        //check if user is already registered
        const registeredUser = await UserStorage.findUser({ spotifyId: spotifyId })
        console.log("result of user find query", registeredUser);

        //if user is not registered create a new user
        if (!registeredUser) {
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
            data.artistScore = {};
            //find recently played tracks and create scores

            await TokenStorage.createToken({
                spotifyId: spotifyId,
                accessToken: req.access_token,
                refreshToken: req.refresh_token
            });

            const tracks = await spotify.getRecentlyPlayed(req.access_token);

            const artistScore = new Map();
            await Promise.all(tracks.map(track => {

                const artists = track.track.artists;

                artists.map(artist => {
                    const { id, name } = artist;
                    console.log(id);
                    console.log(artistScore);
                    //if artistScore already has id as the key -> increment the score
                    if (artistScore.has(id)) {
                        let artistValue = artistScore.get(id);
                        console.log(artistValue)
                        artistValue = {
                            ...artistValue,
                            score: artistValue.score + 1
                        }
                        artistScore.set(id, artistValue)
                    } else {
                        //add the artist to the artistScore
                        artistScore.set(id, {
                            name: name,
                            score: 1
                        })
                    }
                })

            }))
            console.log(artistScore)
            data.artistScore = artistScore;
            const newUser = await UserStorage.createUser(data);
            return res.json({ msg: "successfully logged in with spotify" });
        } else {
            //delete the present token and create a new one


        }

        // console.log("synced model with database");

        res.json({ msg: "successfully logged in with spotify" })
    } catch (err) {
        console.log(err);
        console.log(`error in spotify.js callback function: ${err.msg}`);
        res.json({ msg: "something went wrong" });
    }

})


module.exports = router;