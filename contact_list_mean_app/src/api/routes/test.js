// importing express and instanciating router
const express = require('express')
const router = express.Router()

// GET / => testing if the server is working
router.get('/', (req, res) => {
    res.status(200).send('This is working! :]').end()
})

module.exports = router