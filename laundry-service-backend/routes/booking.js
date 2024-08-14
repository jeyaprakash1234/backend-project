


const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
// const auth = require('../middleware/auth');

// Create a new booking
router.post('/bookingdata', async (req, res) => {
  const { name, phone,address,pincode,date, email , service } = req.body;
  try {
    const newBooking = new Booking({  name, phone,address,pincode,date ,email,  service });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});





// Get all bookings


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
