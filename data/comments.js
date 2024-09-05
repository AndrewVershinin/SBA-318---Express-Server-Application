let comments = [
    { 
        id: 1, 
        postId: 1, 
        content: 'Great post!',
        authorId: 2  // Reference to user ID
    },
    { 
        id: 2, 
        postId: 2, 
        content: 'Very informative.',
        authorId: 1  // Reference to user ID
    },
    { 
        id: 3, 
        postId: 3, 
        content: "I don't like it",
        authorId: 3  // Reference to user ID
    }
  ];
  
module.exports = comments;