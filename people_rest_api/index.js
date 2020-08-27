const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// People > /people
// Person/Row > /people/<id>
// Person/Row/Age > /people/person/age

// --------------
// PROGRAM DATA (IN THE FUTURE IT WILL USE DATABASE)
let peopleData = {
    people: [
        {
            id: 1,
            name: 'eddystream',
            age: 20
        },
        {
            id: 2,
            name: 'alfred',
            age: 22
        },
        {
            id: 3,
            name: 'samantha',
            age: 18
        },
        {
            id: 4,
            name: 'sarah',
            age: 34
        },
    ]
}
let currentId = 4
// --------------
// PROGRAM CONSTANTS

const PEOPLE_URL = '/people'
const PERSON_URL = '/people/:id'


const GET_PERSON_RES = {
    200: (id, name, age) => ({id: id, name: name, age: age}),
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID.'}
}

const POST_RES = {
    201: (id) => ({message: 'The person was added successfully.', id: id}),
    400: {message: 'The request does not contain a valid name and age.'}
}

const PUT_RES = {
    200: {message: 'The person\'s information was updated successfully.'},
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID, name and age.'}
}

const DELETE_RES = {
    200: {message: 'The person\'s information was deleted successfully.'},
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID.'}
}

// --------------
// PROGRAM ENDPOINTS

// GET /people/ => to get info about every person in the server records
app.get(PEOPLE_URL, (req, res) => {
    res.statusCode = 200
    res.json(peopleData)
    res.end()
})


// GET /people/:id => to get info about someone;
app.get(PERSON_URL, (req, res) => {
    if (req.query && req.params.id) {
        let found = false
        for(const person of peopleData.people) {
            if (person.id == req.params.id) {
                res.statusCode = 200
                res.json(GET_PERSON_RES[200](person.id, person.name, person.age))
                found = true
                break
            }
        }
        if (!found) {
            res.statusCode = 404
            res.json(GET_PERSON_RES[404])
        }
    }
    else {
        res.statusCode = 400
        res.json(GET_PERSON_RES[400])
    }

    res.end()
})


// POST /people/ => to insert/create a new person
app.post(PEOPLE_URL, (req, res) => {
    if (req.body && req.body.name && req.body.age) {
        let personId = ++currentId
        peopleData.people.push({
            id: personId,
            name: req.body.name,
            age: req.body.age
        })
        
        res.statusCode = 201
        res.json(POST_RES[201](personId))
    }
    else {
        res.statusCode = 400
        res.json(POST_RES[400])
    }

    res.end()
})


// PUT /people/:id => update information about an already existing person
app.put(PERSON_URL, (req, res) => {
    if (req.params && req.params.id && req.body && req.body.name && req.body.age) {
        let found = false
        for(const person of peopleData.people) {
            if (person.id == req.params.id) {
                person.name = req.body.name
                person.age = req.body.age

                res.statusCode = 200
                res.json(PUT_RES[200])
                found = true
                break
            }
        }
        if (!found) {
            res.statusCode = 404
            res.json(PUT_RES[404])
        }
    }
    else {
        res.statusCode = 400
        res.json(PUT_RES[400])
    }

    res.end()
})


// DELETE /people/:id => delete a person from the server records
app.delete(PERSON_URL, (req, res) => {
    if (req.params && req.params.id) {
        let found = false
        let array = peopleData.people
        for(let i = 0; i < array.length; i++) {
            if (array[i].id == req.params.id) {
                array.splice(i, 1)
                res.statusCode = 200
                res.json(DELETE_RES[200])
                found = true
                break
            }
        }
        if (!found) {
            res.statusCode = 404
            res.json(DELETE_RES[404])
        }
    }
    else {
        res.statusCode = 400
        res.json(DELETE_RES[400])
    }

    res.end()
})

// --------------
app.listen(3000, () => {
    console.log('Server started running on port 3000')
})