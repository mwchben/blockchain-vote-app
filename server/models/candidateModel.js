const mongoose = require("mongoose")

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const candidateModel = mongoose.model("candidates", candidateSchema)
module.exports = candidateModel

