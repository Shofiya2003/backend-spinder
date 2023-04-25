const express = require('express');
const router = express.Router();

const User = require('../models/user');
const authMiddleware = require('../middleware/auth/auth')
const UserStorage = require('../utils/user/userStorage')

router.get('/potentialMatches', authMiddleware, async (req, res) => {
    try {
        //spotifyId of current user
        const spotifyId = res.spotifyId;
        const user = await UserStorage.findUser({ spotifyId: spotifyId });
        const artistScore = user.artistScore;
        const artistIds = artistScore.map(artist => {
            return artist.spotifyId
        })

        const users = await User.aggregate([
            {
                $match: {
                    "spotifyId": { $ne: user.spotifyId }
                }
            },
            {
                $addFields: {
                    "score": 0,
                    "commonArtists": {
                        $filter: {
                            input: "$artistScore",
                            as: "artist",
                            cond: {
                                $in: ["$$artist.spotifyId", artistIds]
                            }
                        }
                    }
                }
            },

            {
                $project: {
                    "artistScore": 1,
                    "spotifyId": 1,
                    "username": 1,
                    "profilePicture": 1,
                    "commonArtists": {
                        $filter: {
                            input: "$artistScore",
                            as: "artist",
                            cond: {
                                $in: ["$$artist.spotifyId", artistIds]
                            }
                        }
                    }

                }
            },
            {
                $project: {
                    "commonArtists": 1,
                    "spotifyId": 1,
                    "username": 1,
                    "profilePicture": 1,
                    "matchingScore": {
                        $reduce: {
                            input: "$commonArtists",
                            initialValue: 0,
                            in: {

                                $add: ["$$value", { $multiply: ["$$this.score", 5] }]
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    "matchingScore": -1
                }
            }
        ])

        console.log(users);
        res.json({ status: "ok", potentialMatches: users })


    } catch (err) {
        console.log(err)
    }
})

router.patch('/', authMiddleware, async (req, res) => {
    try {
        const spotifyId = req.spotifyId;
        const { username } = req.body;
        const data = {
            username: username
        }
        UserStorage.updateUser(spotifyId, data);
        return res.json({ status: 'success', msg: 'updated profile' })
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error', msg: 'update failed' })
    }
})
module.exports = router;