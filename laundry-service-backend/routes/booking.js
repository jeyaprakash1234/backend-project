const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

 
router.post('/', auth, async (req, res) => {
  const { service,phone,name, address, pincode } = req.body;

  try {
    const newBooking = new Booking({
      user: req.user.id,
      service,
      name,
      phone,
      
      address,
      pincode
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Booking = require('../models/Booking');

// // Create a new booking
// router.post('/bookingdata', async (req, res) => {
//   const { name, phone,address,pincode,  service } = req.body;
//   try {
//     const newBooking = new Booking({ name, phone,address,pincode,  service });
//     await newBooking.save();
//     res.status(201).json(newBooking);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Get all bookings
// router.get('/', async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.status(200).json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
