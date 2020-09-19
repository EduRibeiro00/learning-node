// importing mongoose
const mongoose = require('mongoose')

// creating schema for storing contacts in MongoDB database
const ContactSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        validate: {
            validator: value => Number.isInteger(value) && value >= 0,
            message: props => `${props.value} is not a valid age.`
        }
    },
    phone_number: {
        type: String,
        required: false,
        validate: {
            validator: value => /^[0-9]{9}$/.test(value),
            message: props => `${props.value} is not a valid phone number.`
        }
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    }
})

ContactSchema.methods.toJSON = function() {
    let obj = this.toObject()
    delete obj.__v
    return obj
}

module.exports = mongoose.model('Contact', ContactSchema)