const app = require('./utils/conf')
const peopleRouter = require('./routes/people')

// --------------
// PROGRAM ENDPOINTS
app.use('/people', peopleRouter)

// --------------
// SETUP SERVER
app.listen(3000, () => {
    console.log('Server started running on port 3000')
})