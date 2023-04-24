const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/potentialMatches', async (req, res) => {
    try {
        //spotifyId of current user
        const spotifyId = "";
        const array = ["69As4MCKWsge98Vh3kmiJe", "3cqeO3muWIW5uSmUDNCmyT"]
        const users = await User.aggregate([
            {
                $addFields: {
                    "score": 0,
                    "commonArtists": {
                        $filter: {
                            input: "$artistScore",
                            as: "artist",
                            cond: {
                                $in: ["$$artist.spotifyId", array]
                            }
                        }
                    }
                }
            },

            {
                $project: {
                    "artistScore": 1,
                    "spotifyId": 1,
                    "commonArtists": {
                        $filter: {
                            input: "$artistScore",
                            as: "artist",
                            cond: {
                                $in: ["$$artist.spotifyId", array]
                            }
                        }
                    }

                }
            },
            {
                $project: {
                    "commonArtists": 1,
                    "spotifyId": 1,
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

module.exports = router;