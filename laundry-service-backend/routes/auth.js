const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        'yourJWTSecret', // Use config or environment variable for real applications
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        'yourJWTSecret', // Use config or environment variable for real applications
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//forgot-password
router.post('/forgot-password',(req,res)=>{
  const {email}=req.body;
  User.findOne({email: email}) 
  .then(user=>{
   if(!user){
       return res.send({Status:"user not existed"})
   }
   const token = jwt.sign({id:user._id},"yourJWTSecret", {expiresIn: "1d"})
   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hhtfcjp@gmail.com',
      pass: 'zlaswvkunhfovpqh'
    }
  });
  
  var mailOptions = {
    from: email,
    to: email,
    subject: 'Reset your password',
    text: `http://localhost:3000/resetpassword/${user._id}/${token}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
     return res.send({status:'Success'})
    }
  });
  })
})

router.post('/reset-password/:id/:token',(req,res)=>{
  const {id, token} = req.params
  const{password}= req.body
  console.log(id,token)
  

  jwt.verify(token,'yourJWTSecret',(err, decoded)=>{
    if(err){
      return res.json({Status:"Error with token"})
    }else{
      bcrypt.hash(password,10)
      .then(hash=>{
        User.findByIdAndUpdate({_id:id},{password: hash})
        .then(u => res.send({Status:"Success"}))
        .catch(err =>res.send({status:err}))
      })
      .catch(err =>res.send({status:err}))

    }
  })
})



module.exports = router;
