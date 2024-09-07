const express = require('express');
const comments = require('../data/comments');
const router = express.Router();
const posts = require('../data/posts');
const users = require('../data/users');  // Assuming you have a list of users

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
        res.json(comments); // Get all comments
    })
    .post((req, res, next) => {
        const { content, authorId, postId } = req.body;

        // Check if the author and post exist
        const author = users.find(u => u.id === parseInt(authorId));
        const post = posts.find(p => p.id === parseInt(postId));

        if (!author) {
            return next(createError(404, 'Author not found'));
          }
        if (!post) {
        return next(createError(404, 'Post not found'));
        }

        if (content && authorId && postId) {
            const newComment = {
                    id: comments.length ? comments[comments.length - 1].id + 1 : 1,
                    postId: parseInt(postId),
                    content,
                    authorId: parseInt(authorId)
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