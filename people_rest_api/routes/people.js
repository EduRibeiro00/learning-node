const mysql = require('mysql')
const express = require('express')
const mySqlConnection = require('../utils/connection')

let router = express.Router()

const PEOPLE_URL = '/'
const PERSON_URL = '/:id'

const GET_PEOPLE_RES = {
    200: (data) => ({people: data}),
    500: (error) => ({message: 'An error happened when trying to fetch the data.', error: error})
}

const GET_PERSON_RES = {
    200: (id, name, age) => ({id: id, name: name, age: age}),
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID.'},
    500: (error) => ({message: 'An error happened when trying to fetch the data.', error: error})
}

const POST_RES = {
    201: (id) => ({message: 'The person was added successfully.', id: id}),
    400: {message: 'The request does not contain a valid name and age.'},
    500: (error) => ({message: 'An error happened when trying to fetch the data.', error: error})
}

const PUT_RES = {
    200: {message: 'The person\'s information was updated successfully.'},
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID, name and age.'},
    500: (error) => ({message: 'An error happened when trying to fetch the data.', error: error})
}

const DELETE_RES = {
    200: {message: 'The person\'s information was deleted successfully.'},
    404: {message: 'There is no person with the specified ID.'},
    400: {message: 'The request does not contain a valid ID.'},
    500: (error) => ({message: 'An error happened when trying to fetch the data.', error: error})
}


// ----------------------------------


// GET /people/ => to get info about every person in the server records
router.get(PEOPLE_URL, (req, res) => {
    let query = "SELECT * FROM people"
    mySqlConnection.query(query, (error, rows, fields) => {
        if (error) {
            res.status(500).json(GET_PEOPLE_RES[500](error)).end()
        }
        else {
            res.status(200).json(GET_PEOPLE_RES[200](rows)).end()   
        }
    })
})


// GET /people/:id => to get info about someone
router.get(PERSON_URL, (req, res) => {
    if (req.params && req.params.id) {
        let query = "SELECT * FROM people WHERE id = ?"
        mySqlConnection.query(query, [req.params.id], (error, rows, fields) => {
            if (error) {
                res.status(500).json(GET_PERSON_RES[500](error)).end()
            }
            else {
                if (rows && rows.length)
                    res.status(200).json(GET_PERSON_RES[200](rows[0]['id'], rows[0]['name'], rows[0]['age'])).end()
                else
                    res.status(404).json(GET_PERSON_RES[404]).end()
            }
        })
    }
    else {
        res.status(400).json(GET_PERSON_RES[400]).end()
    }
})


// // POST /people/ => to insert/create a new person
router.post(PEOPLE_URL, (req, res) => {
    if (req.body && req.body.name && req.body.age) {
        let query = "INSERT INTO people(name, age) VALUES(?, ?)"
        mySqlConnection.query(query, [req.body.name, req.body.age], (error, result) => {
            if (error)
                res.status(500).json(POST_RES[500](error)).end()
            else
                res.status(201).json(POST_RES[201](result.insertId)).end()
        })
    }
    else
        res.status(400).json(POST_RES[400]).end()
})


// // PUT /people/:id => update information about an already existing person
router.put(PERSON_URL, (req, res) => {
    if (req.params && req.params.id && req.body && req.body.name && req.body.age) {
        let query = "UPDATE people SET name = ?, age = ? WHERE id = ?"
        mySqlConnection.query(query, [req.body.name, req.body.age, req.params.id], (error, result) => {
            if (error)
                res.status(500).json(PUT_RES[500](error)).end()
            else {
                if (result && result.affectedRows)
                    res.status(200).json(PUT_RES[200]).end()
                else
                    res.status(404).json(PUT_RES[404]).end()
            }

        })
    }
    else
        res.status(400).json(PUT_RES[400]).end()
})


// DELETE /people/:id => delete a person from the server records
router.delete(PERSON_URL, (req, res) => {
    if (req.params && req.params.id) {
        let query = "DELETE FROM people WHERE id = ?"
        mySqlConnection.query(query, [req.params.id], (error, result) => {
            if (error)
                res.status(500).json(DELETE_RES[500](error)).end()
            else {
                if (result && result.affectedRows)
                    res.status(200).json(DELETE_RES[200]).end()
                else
                    res.status(404).json(DELETE_RES[404]).end()
            }

        })
    }
    else
        res.status(400).json(DELETE_RES[400]).end()
})


module.exports = router