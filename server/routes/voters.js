const express = require("express")
const router = express.Router()

//requiring this tables since voter should GET list of candidates
const candidateModel = require("../models/candidate")




//get all candidates route