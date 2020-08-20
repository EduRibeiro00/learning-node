const nano = require("nano")

exports.create = (request, response) => {
    nano.bd.create(request.body.dbname, (error) => {
        if (error) {
            response.send('Error creating the database')
            return
        }
        else {
            response.send('Database created succefully')
        }
    })
}