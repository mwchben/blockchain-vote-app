const express = require("express")
const router = express.Router()
const voterModel = require("../models/voterModel")
const indexMiddleware = require("../middlewares/index")
const voterController = require('../controllers/voterController')
const voterAuthJWT = require('../middlewares/authVoter')
const checkVoter = require('../middlewares/checkVoter')


/*
   create a voter { SignUp } and { login }
*/
router.post("/reg", indexMiddleware.registerVoter)
router.post("/log", indexMiddleware.loginVoter)

/*
    get voter pages
*/
router.get("/dashboard", voterAuthJWT, checkVoter, voterController.get_dash)
router.get("/logout", voterController.get_home)

/*
    get one voter route { by Moderator}
*/
router.get("/:id", indexMiddleware.getVoter, (req, res) => {
    res.json(res.voter)
})

/*
   get all voters route { by Moderator}
*/
router.get("/", async (req, res) => {
    try {
        const voters = await voterModel.find()
        res.send(voters)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// router.post("/", registerVoter, async (req, res) => {
//     try {
//         const newVoter = await voterModel.create({
//             name: req.body.name,
//             email: req.body.email,
//             regno: req.body.regno,
//             password: req.body.password
//         })

//         res.status(201).json(newVoter)
//     } catch (error) {
//         res.status(400).json({
//             message: error.message,
//             // error: 'Duplicate email (check paper sheet on email unique) perrform in the create email splitting**'
//         })
//     }
// })

/*
    delete a voter { By Moderator }
*/
router.delete("/:id", indexMiddleware.getVoter, async (req, res) => {
    try {
        await res.voter.remove()
        res.json({ message: "deleted the voter" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router



//res.json vs res.send
//res.json eventually calls res.send, but before that it:
// respects the json spaces and json replacer app settings
// ensures the response will have utf-8 charset and application/json Content-Type