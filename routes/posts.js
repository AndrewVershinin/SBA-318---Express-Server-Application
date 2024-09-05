const express = require('express');
const router = express.Router();
const posts = require('../data/posts');

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
        res.json(posts); // Get all posts
    })
    .post((req, res) => {
        if (req.body.title && req.body.content && req.body.authorId) {
            const newPost = {
                id: posts.length ? posts[posts.length - 1].id + 1 : 1,
                title: req.body.title,
                content: req.body.content,
                authorId: req.body.authorId
            };
            posts.push(newPost);
            res.status(201).json(newPost);
        } else {
            return next(createError(400, 'Insufficient Data'));
        }
    });

// Chain routes with .route() for GET, PATCH and DELETE
router
    .route('/:id')
    .get((req, res) => {
        const post = posts.find(p => p.id === parseInt(req.params.id));
        if (post) {
            res.json(post); // Respond with the specific post
        } else {
            res.status(404).send('Post not found')
        }
    })
    .patch((req, res) => {
        const post = posts.find(p => p.id === parseInt(req.params.id));
        if (post) {
            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;
            post.authorId = req.body.authorId || post.authorId;
            res.json(post);  // Respond with the updated post
        } else {
            res.status(404).send('Post not found');
        }
    })
    .delete((req, res) => {
        const index = posts.findIndex(p => p.id === parseInt(req.params.id));
        if (index !== -1) {
            posts.splice(index, 1);  // Remove the post from the array
            res.status(204).send();  // Respond with no content status
        } else {
            res.status(404).send('Post not found');
        }
    });

module.exports = router;