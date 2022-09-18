require("dotenv").config({ path: "../config.env" });
const jwt = require("jsonwebtoken")
const candidateModel = require("../models/candidateModel")


const checkCandidate = (req, res, next) => {
    const candidateToken = req.cookies.candidateLoginJWT;

    if (candidateToken) {
        jwt.verify(candidateToken, process.env.JWTOKEN, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.candidate = null
                next()
            } else {
                console.log(decodedToken);
                let candidate = await candidateModel.findById(decodedToken.id)
                res.locals.voter = candidate
                next()
            }
        })
    } else {
        res.locals.candidate = null
        next()
    }
}


module.exports = checkCandidate;