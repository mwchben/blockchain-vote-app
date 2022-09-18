require("dotenv").config({ path: "../config.env" });
const jwt = require("jsonwebtoken")
const voterModel = require("../models/voterModel")


const checkVoter = (req, res, next) => {
    const voterToken = req.cookies.voterLoginJWT;

    if (voterToken) {
        jwt.verify(voterToken, process.env.JWTOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.voter = null
                next()
            } else {
                console.log(decodedToken);
                let voter = await voterModel.findById(decodedToken.id)
                res.locals.voter = voter
                next()
            }
        })
    } else {
        res.locals.voter = null
        next()
    }
}


module.exports = checkVoter;