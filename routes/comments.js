const express = require('express');
const comments = require('../data/comments');
const router = express.Router()

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
        res.json(comments); // Ger all comments
    })
    .post((req, res, next) => {
        if (req.body.postId && req.body.content && req.body.authorId) {
            const newComment = {
                    id: comments.length ? comments[comments.length - 1].id + 1 : 1,
                    postId: req.body.postId,
                    content: req.body.content,
                    authorId: req.body.authorId
                };
                comments.push(newComment); // Add new comment to the comments Array
                res.status(201).json(newComment);
            } else {
                return next(createError(400, 'Insufficient Data'));
            }       
    });

// Chain routes with .route() for GET, PATCH, and DELETE by ID   
router
    .route('/:id')
    .get((req, res) => {
        const comment = comments.find(c => c.id === parseInt(req.params.id));
        if (comment) {
            res.json(comment); // Respond with the specific comment
        } else {
            res.status(400).send('Comment not found')
        }
    })
    .patch((req, res) => {
        const comment = comments.find(c => c.id === parseInt(req.params.id));
        if (comment) {
            comment.postId = req.body.content || comment.postId;
            comment.content = req.body.content || comment.content;
            comment.authorId = req.body.authorId || comment.authorId;
            res.json(comment)
        } else {
            res.status(404).send('Comment not found')
        }
    })
    .delete((req, res) => {
        const index = comments.findIndex(c => c.id === parseInt(req.params.id));
        if (index !== -1) {
            comments.splice(index, 1); // Remove the comment from the array
            res.status(204).send(); // Respond with no content status
        } else {
            res.status(404).send('Comment not found')
        }
    });

    module.exports = router;