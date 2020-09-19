// importing mongoose and constants
const mongoose = require('mongoose')
const consts = require('../utils/consts')

const connectToDatabase = () => {
    // connecting to the MongoDB database
    mongoose.connect(consts.MONGO_DB_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })

    // on connection
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB database @ 27017')
    })

    // on error
    mongoose.connection.on('error', (error) => {
        if (error)
            console.log(`Error in database connection - ${error}`)
    })
}

module.exports = connectToDatabase