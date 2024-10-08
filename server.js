const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const path = require('path');

// Import data
const usersRouter = require("./routes/users");
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static('public'));

// Custom Middleware
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Use Routes
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)

// Route to render index.ejs
app.get('/', (req,res) => {
    const users = require('./data/users');
    const posts = require('./data/posts');
    const comments = require('./data/comments');

    res.render('index', { users, posts, comments });
});



// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});