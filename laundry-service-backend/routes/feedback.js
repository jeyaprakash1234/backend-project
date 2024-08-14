

const express = require('express');
const router = express.Router();

// Dummy feedback array (You should store it in a database in a real application)
let feedbacks = [];

// POST route for feedback submission
router.post('/api/feedback', (req, res) => {
    const { rating, comments } = req.body;

    // Validate the input (You might want to add more validation)
    if (!rating || !comments) {
        return res.status(400).json({ msg: 'Please provide a rating and comments.' });
    }

    // Save feedback to your database here (this is just a dummy example)
    const newFeedback = { id: feedbacks.length + 1, rating, comments };
    feedbacks.push(newFeedback);

    // Send a success response
    res.status(201).json({ msg: 'Feedback submitted successfully', feedback: newFeedback });
});

module.exports = router;
