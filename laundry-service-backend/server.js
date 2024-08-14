const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();
require('dotenv').config();
const feedbackRoute = require('./routes/feedback');
const nodemailer = require('nodemailer');
const Booking = require('./models/Booking');







// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/booking', require('./routes/booking'));


app.use(feedbackRoute);


// Endpoint to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await Booking.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

app.post('/api/users/:id/send-email', async (req, res) => {
    const { id } = req.params;
    const { content,email } = req.body;
console.log(id)

    try {
        const user = await Booking.findById(id);
        console.log(user)
        if (!user) {
            
            return res.status(404).send('User not found');
        }

        // Nodemailer transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',  
            host:"smtp.ethereal.email",
            port:587,  
            auth: {
                user: 'hhtfcjp@gmail.com',
                pass: 'zlaswvkunhfovpqh'
            }
        });

        // Email options
        var mailOptions = {
            from: email,
            to: user.email,
            subject: 'CleanEase',
            text: content 
        };

        // Send email
        transporter.sendMail(mailOptions,  function(error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                  return res.send('Email sent successfully');
            }
        });

    }catch (error) {
        console.log('Error in send-email endpoint:', error); // Log the error
        res.status(500).send('Internal Server Error');
    }  
    
});


app.post('/api/booking/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const { content,email} = req.body;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        // Nodemailer transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host:"smtp.ethereal.email",
            port:587,
            auth: {
                user: 'hhtfcjp@gmail.com',
                pass: 'zlaswvkunhfovpqh'
            }
        });

        // Email options
        var mailOptions = {
            from: email,
            to: booking.email,
            subject: 'Booking Cancellation',
            // text: content,
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
            <p>We received Your Booking But {content}</p>

            <p>Call:+(91)123455654 </p>
        </div>
        <div class="footer">
            <p>Thank you,<br>The CleanEase Team</p>
        </div>
    </div>
</body>
</html>`

        };

        // Send email
        transporter.sendMail(mailOptions, function(error, info)  {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.send('Booking cancelled and email sent to user');
            }
        });

        // Optionally, remove or update the booking in the database
        await Booking.findByIdAndDelete(id);
    } catch (error) {
        res.status(500).send('Error cancelling booking');
    }
});


















// Schedule notifications



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
