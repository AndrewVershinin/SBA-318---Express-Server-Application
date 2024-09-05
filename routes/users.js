const express = require("express");
const router = express.Router();
const users = require('../data/users');

// Helper function for error creation
const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

// Chain routes with .route() for GET and POST
router
    .route('/')
    .get((req, res) => {
        res.json(users) // Get all users
    })
    .post((req, res, next) => {
        // Check if the required fields are present in the request body
        if (req.body.name && req.body.username && req.body.email) {
            // Check if the username is already take
            if (users.find((u) => u.username == req.body.username)) {
                // If taken, call next() with a 409 error
                return next(error(409, "Username Already Taken"));
            }
            // Create a new user object
            const newUser = { 
                id: users.length ? users[users.length - 1].id + 1 : 1,
                name: req.body.name,
                username: req.body.username,
                email: req.body.email
            };
            users.push(newUser); // Add new user to the users array
            res.status(201).json(users[users.length - 1]);
        } else {
            // Call next() with a 400 error if data is insufficient
            return next(createError(400, "Insufficient Data"));
        }
    });
    
// Chain routes with .route() for GET, PATCH and DELETE
router
    .route('/:id')
    .get((req, res) => {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (user) {
            res.json(user); // Respond with uder data
        } else {
            res.status(404).send('User not found')
        }
    })
    .patch((req, res) => {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.name = req.body.name || user.name;
            res.json(user);  // Respond with the updated user
        } else {
            res.status(404).send('User not found');
        }
    })
    .delete((req, res) => {
        const index = users.findIndex(u => u.id === parseInt(req.params.id));
        if (index !== -1) {
          users.splice(index, 1);  // Remove the user from the array
          res.status(204).send();  // Respond with no content status
        } else {
          res.status(404).send('User not found');
        }
    });

module.exports = router;