const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

// Import data
const usersRouter = require("./routes/users");
const posts = require('./data/posts');
const comments = require('./data/comments');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('public'));

// Custom Middleware
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Use Routes
app.use('/users', usersRouter)

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});