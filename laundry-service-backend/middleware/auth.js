// const jwt = require('jsonwebtoken');
// // const config = require('config');

// module.exports = function(req, res, next) {
//   // Get token from header
//   const token = req.header('Authorization').split(' ')[1];


//   // Check if not token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.jWT_SECRET); 
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };



 const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extracts the token from the 'Bearer <token>' format

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.jWT_SECRET)
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// const jwt = require('jsonwebtoken');
// const config = require('config'); // assuming you're using a config file for the secret

// module.exports = function (req, res, next) {
//     // Get token from header
//     const token = req.header('Authorization');

//     // Check if no token
//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token.split(' ')[1], config.get('jWT_SECRET'));

//         // Add user from payload
//         req.userId = decoded.userId;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' });
//     }
// };
