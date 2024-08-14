

const express = require('express');
const router = express.Router();


let feedbacks = [];


router.post('/api/feedback', (req, res) => {
    const { rating, comments } = req.body;

   
    if (!rating || !comments) {
        return res.status(400).json({ msg: 'Please provide a rating and comments.' });
    }

   
    const newFeedback = { id: feedbacks.length + 1, rating, comments };
    feedbacks.push(newFeedback);

   
    res.status(201).json({ msg: 'Feedback submitted successfully', feedback: newFeedback });
});

module.exports = router;
