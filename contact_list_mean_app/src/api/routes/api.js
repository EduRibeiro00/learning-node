// importing express and instanciating router
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

// importing mongoose contact schema and other utilities
const Contact = require('../mongo_db/models/contact')

// ----------------------------------------------------------------------
// possible responses for each endpoint and request
const GET_ALL_RES = {
    200: data => ({contacts: data}),
    500: error => ({message: 'An error ocurred.', error: error})
}

const GET_RES = {
	200: contact => ({contact: contact}),
	400: id => ({message: 'The specified parameter isn\'t a valid id.', id: id}),
	404: id => ({message: 'There is no contact with the specified id.', id: id}),
	500: error => ({message: 'An error ocurred.', error: error})
}

const POST_RES = {
    201: contact => ({message: 'The contact has been successfuly added.', contact: contact}),
    400: error => ({message: 'The request body is invalid.', error: error}),
    500: error => ({message: 'An error ocurred.', error: error})
}

const PUT_RES = {
	200: contact => ({message: 'The contact has been successfuly updated.', contact: contact}),
    400: id => ({message: 'The specified parameter isn\'t a valid id.', id: id}),
	404: id => ({message: 'There is no contact with the specified id.', id: id}),
    500: error => ({message: 'An error ocurred.', error: error})
}

const DELETE_RES = {
	200: id => ({message: 'The contact with the specified id was deleted.', id: id}),
	400: id => ({message: 'The specified parameter isn\'t a valid id.', id: id}),
	404: id => ({message: 'There is no contact with the specified id.', id: id}),
    500: error => ({message: 'An error ocurred.', error: error})
}

// ----------------------------------------------------------------------
// GET /api/contacts/ => retrieving the contact list
router.get('/contacts', (req, res) => {
    Contact.find((error, contacts) => {
        if (error)
            res.status(500).json(GET_ALL_RES[500](error)).end()
        else
            res.status(200).json(GET_ALL_RES[200](contacts)).end()
    })
})

// ----------------------------------------------------------------------
// GET /api/contacts/:id => retrieving a specific contact from list
router.get('/contacts/:id', (req, res) => {
	if (mongoose.Types.ObjectId.isValid(req.params.id)) {
		Contact.findById(req.params.id, (error, contact) => {
			if (error)
				res.status(500).json(GET_RES[500](error)).end()
			else {
				if (contact)
					res.status(200).json(GET_RES[200](contact)).end()
				else
					res.status(404).json(GET_RES[404](req.params.id)).end()
			}
		})
	}
	else
		res.status(400).json(GET_RES[400](req.params.id)).end()
})

// ----------------------------------------------------------------------
// POST /api/contacts/ => add contact to list
router.post('/contacts', (req, res) => {
	let newContact = new Contact({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		age: req.body.age,
		phone_number: req.body.phone_number,
		address: req.body.address,
		city: req.body.city
	})

	newContact.save((error, contact) => {
		if (error) {
			if (error.name == 'ValidationError')
				res.status(400).json(POST_RES[400](error)).end()
			else
				res.status(500).json(POST_RES[500](error)).end()
		}
		else
			res.status(201).json(POST_RES[201](contact)).end()
	})
})

// ----------------------------------------------------------------------
// PUT /api/contacts/:id => update existing contact info
router.put('/contacts/:id', (req, res) => {
	if (mongoose.Types.ObjectId.isValid(req.params.id)) {
		Contact.updateOne(
			{_id: req.params.id}, 
			req.body,
			(error, result) => {
				if (error)
					res.status(500).json(PUT_RES[500](error)).end()
				else if (result.n)
					res.status(200).json(PUT_RES[200](req.params.id)).end()
				else
					res.status(404).json(PUT_RES[404](req.params.id)).end()
			}
		)
	}
	else
		res.status(400).json(PUT_RES[400](req.params.id)).end()
})

// ----------------------------------------------------------------------
// DELETE /api/contacts/:id => delete contact from list
router.delete('/contacts/:id', (req, res) => {
	if (mongoose.Types.ObjectId.isValid(req.params.id)) {
		Contact.deleteOne({_id: req.params.id}, (error, result) => {
			if (error)
				res.status(500).json(DELETE_RES[500](error)).end()
			else if (result.deletedCount)
				res.status(200).json(DELETE_RES[200](req.params.id)).end()
			else
				res.status(404).json(DELETE_RES[404](req.params.id)).end()
		})
	}
	else
		res.status(400).json(DELETE_RES[400](req.params.id)).end()
})

// ----------------------------------------------------------------------
// export the router and all its endpoints
module.exports = router