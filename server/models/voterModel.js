const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const voterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Your name is required!']
    },
    email: {
        type: String,
        required: [true, 'A tuk email is required!'],
        unique: true, //[true, 'Email is already registered!'],
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
    }
});

voterSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//static method to login voter
voterSchema.statics.login = async function (email, password) {
    const voter = await this.findOne({ email: email })
    if (voter) {
        const ruhusu = await bcrypt.compare(password, voter.password)
        if (ruhusu) {
            return voter
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

const voterModel = mongoose.model("voter", voterSchema) //args(name of model in db, schema)
module.exports = voterModel