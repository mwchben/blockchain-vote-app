const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Your name is required!']
    },
    email: {
        type: String,
        required: [true, 'A tuk email is required!'],
        unique: true,
        validate: {
            validator: function (v) {
                return /@students\.tukenya\.ac\.ke/i.test(v);
            },
            message: props => `${props.value} is not a valid tuk email!`
        },
    },
    regno: {
        type: String,
        required: [true, 'Registration number is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [7, 'Minimum password length is 7 characters']
    },
});

candidateSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//static method to login candidate
candidateSchema.statics.login = async function (email, password) {
    const candidate = await this.findOne({ email: email })
    if (candidate) {
        const ruhusu = await bcrypt.compare(password, candidate.password)
        if (ruhusu) {
            return candidate
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

const candidateModel = mongoose.model("candidate", candidateSchema)
module.exports = candidateModel

