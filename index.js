const COUCH_DB_URL = 'http://localhost:5984'
const DEFAULT_PORT = 3000

// import all needed packages and files
let express = require('express')
let http = require('http')
let path = require('path')
let urlEncoded = require('url')
let bodyParser = require('body-parser')
let json = require('json')
let logger = require('logger')
let methodOverride = require('method-override')

let routes = require('./routes')

// import/create connection to CouchDB database
let nano = require('nano')(COUCH_DB_URL)

// connect with 'address' database
let db = nano.use('address')
let app = express()

// set some values for express
app.set('port', process.env.PORT || DEFAULT_PORT)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

// define routes
app.get('/', routes.index)

app.post('/createdb', (request, response) => {
    let dbName = request.body.dbname
    nano.db.create(dbName, (error) => {
        if (error) {
            response.send("Database could not be created\n\n" + error)
            return
        }
        response.send('Database ' + dbName + ' created successfully')
    })
})

// insert/create contact
app.post('/contact', (request, response) => {
    let name = request.body.name
    let phone = request.body.phone

    db.insert(
        {name:name, phone:phone, crazy:true},
        phone,
        (error, body, header) => {
            if (error) {
                response.send('Error creating contact\n\n' + error)
                return
            }
            response.send('Contact created successfully')
        }
    )
})

// get contact
app.get('/contact', (request, response) => {
    let all = 'Following are all the contacts:'
    db.get(
        request.body.phone,
        {revs_info:true},
        (error, body) => {
            if (!error) {
                console.log(body)
            }
            if (body) {
                all += 'Name: ' + body.name + '<br/>Phone Number: ' + body.phone
            }
            else {
                all = 'No records found'
            }
            response.send(all)
        }
    )
})

// delete contact
app.delete('/contact', (request, response) => {
    db.get(
        request.body.phone,
        {revs_info:true},
        (error, body) => {
            if (!error) {
                db.destroy(
                    request.body.phone,
                    body._rev,
                    (error, body) => {
                        if (error) {
                            response.send('Error deleting contact\n\n' + error)
                        }
                        else {
                            response.send('Contact deleted successfully')
                        }
                    }    
                )
            }
        }
    )
})

// create server
http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'))
})