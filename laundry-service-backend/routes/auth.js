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
    host:"smtp.ethereal.email",
    port:587,
 
    auth: {
      user: 'hhtfcjp@gmail.com',
      pass: 'zlaswvkunhfovpqh'
    }
  });
  
  var mailOptions = {
    from: email,
    to: email,
    subject: 'Reset your password',
    
    html:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: 20px auto;
        }
        .header {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333333;
        }
        .content {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaaaaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Reset Your Password
        </div>
        <div class="content">
            <p>Hello sir/mam,</p>
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <a href="https://frontend-project-eight-pi.vercel.app//resetpassword/${user._id}/${token}" class="button">Reset Password</a>
            <p>If you didn't request a password reset, you can safely ignore this email. Rest assured your account is safe.</p>
        </div>
        <div class="footer">
            <p>Thank you,<br>The CleanEase Team</p>
        </div>
    </div>
</body>
</html>
`
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
