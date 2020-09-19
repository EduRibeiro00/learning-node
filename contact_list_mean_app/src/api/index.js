// importing modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

// importing local modules
const consts = require('./utils/consts')
const connectToDatabase = require('./mongo_db/connection')

// importing routes
const homeRouter = require('./routes/test')
const apiRouter = require('./routes/api')

// express instance and configuring
const app = express()
app.use(cors()) // adding middleware - cors
app.use(bodyParser.json()) // body-parser
app.use(bodyParser.urlencoded({ extended: true })) // to use x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public'))) // static files

// connecting the routers
app.use('/', homeRouter)
app.use('/api', apiRouter)


// connecting to MongoDB database
connectToDatabase()

// connecting to port
app.listen(consts.PORT, () => {
    console.log(`Server started on port ${consts.PORT}`)
})