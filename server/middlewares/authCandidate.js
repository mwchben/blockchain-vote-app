require("dotenv").config({ path: "../config.env" });
const jwt = require("jsonwebtoken")

const candidateAuthJWT = (req, res, next) => {
    const candidateToken = req.cookies.candidateLoginJWT;
    //const voterToken = req.headers.authorization.split('')[1]

    if (candidateToken) {
        jwt.verify(candidateToken, process.env.JWTOKEN, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.json({
                    error: err
                })
                res.redirect('/candidateLog')

            } else {
                console.log(decodedToken);
                //can set the req.autheticated = true and access it in react from tutorial "Protected Routes in React _ Router Redirect _ React Router Dom _ React Tutorial .mp4"
                next();
            }
        })
    } else {
        // res.json({
        //     error: "not authenticated, login or register to access"
        // })
        res.redirect('/candidateLog')
    }
}


module.exports = candidateAuthJWT;