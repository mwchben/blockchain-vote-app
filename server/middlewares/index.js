require("dotenv").config({ path: "./config.env" });
const voterModel = require("../models/voterModel")
const candidateModel = require("../models/candidateModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/*

handle ERRORS!! 

*/

function handleError(error) {
    console.log(error.message, error.code);
    var errorValues = {
        name: '',
        email: '',
        regno: '',
        password: ''
    }

    if (error.message === 'Incorrect Email') {
        errorValues.email = 'This tuk email is not registered'
    }

    if (error.message === 'Incorrect Password') {
        errorValues.password = 'Wrong Password'
    }

    if (error.code === 11000) {
        errorValues.email = 'Email already registered';
        return errorValues;
    }

    if (error.message.includes('candidate validation failed') || error.message.includes('voter validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            errorValues[properties.path] = properties.message;
        })
    }

    return errorValues;
}

/*

create JWT token

*/

const expiry = 1 * 24 * 60 * 60;
function createToken(id) {
    //payload and headers hashed with this "process.env.JWTOKEN" to create the signature
    return jwt.sign({ id }, process.env.JWTOKEN, { expiresIn: expiry })
}


/*

VOTER

*/

//middleware to register wth req, res..................................................................
const registerVoter = (req, res, next) => {

    let voter = new voterModel({
        name: req.body.name,
        email: req.body.email,
        regno: req.body.regno,
        password: req.body.password
    })
    voter.save()
        .then(voter => {
            res.json({ success_msg: "You are registered! Login now to your profile" })
        })
        .catch(error => {
            const errors = handleError(error)
            res.json({ errors: errors })
        })
}
//middleware to login with req, res....................................................................
const loginVoter = async (req, res, next) => {
    let email = req.body.email
    let password = req.body.password

    try {
        const voter = await voterModel.login(email, password)
        let token = createToken(voter._id);
        res.cookie('voterLoginJWT', token, { httpOnly: true, maxAge: expiry * 1000 });
        res.json({
            message: "Voter successfull login!",
            token: token,
            voter: voter._id
        })
    } catch (error) {
        const errors = handleError(error)
        res.json({ errors: errors })
    }

    /* 
    
    ***another way***
    voterModel.findOne({ email: email })
        .then(voter => {
            if (voter) {
                bcrypt.compare(password, voter.password, function (err, result) {
                    if (err) {
                        res.json({ error: err })
                    }
                    if (result) {
                        //let token = jwt.sign({ regno: voter.regno }, "tokenValue", { expiresIn: "1hr" })
                        let token = createToken(voter.email);

                        res.cookie('voterLoginJWT', token, { httpOnly: true, maxAge: expiry * 1000 });
                        res.json({
                            message: "Voter successfull login!",
                            token: token,
                            voter: voter._id
                        })
                    }
                    else {
                        res.json({ errors: "Password mismatch!" })
                    }
                })  
            } else {
                res.json({ errors: "Voter does not exist" })
            }
        }) 
        
        */
}

//middleware to getID..................................................................................
async function getVoter(req, res, next) {
    let voter
    try {
        voter = await voterModel.findById(req.params.id)
        if (voter == null) {
            return res.status(404).json({ message: "Cannot find voter" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.voter = voter
    next()
}



/*

CANDIDATE

*/

//middleware to register with req, res..................................................................
const registerCandidate = (req, res, next) => {

    let candidate = new candidateModel({
        name: req.body.name,
        email: req.body.email,
        regno: req.body.regno,
        password: hashedPassword
    })
    candidate.save()
        .then(candidate => {
            res.json({ success_msg: "You are registered! Login now to your profile" })
        })
        .catch(error => {
            const errors = handleError(error)
            res.json({ message: errors })
        })
}
//middleware to login with req, res.....................................................................
const loginCandidate = async (req, res, next) => {
    let email = req.body.email
    let password = req.body.password

    try {
        const candidate = await candidateModel.login(email, password)
        let token = createToken(candidate._id);
        res.cookie('candidateLoginJWT', token, { httpOnly: true, maxAge: expiry * 1000 });
        res.json({
            message: "Candidate successfull login!",
            token: token,
            voter: candidate._id
        })
    } catch (error) {
        const errors = handleError(error)
        res.json({ errors: errors })
    }
}
//middleware to getID....................................................................................
async function getCandidate(req, res, next) {
    let candidate
    try {
        candidate = await candidateModel.findById(req.params.id)
        if (candidate == null) {
            return res.status(404).json({ message: "Cannot find candidate" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.candidate = candidate
    next()
}

module.exports = { registerVoter, loginVoter, registerCandidate, loginCandidate, getVoter, getCandidate }