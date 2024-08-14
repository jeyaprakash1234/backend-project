const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  //  user: {
  //    type: mongoose.Schema.Types.ObjectId,
  //    ref: 'User',
  //    required: true
  //  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  service: {
    type: String,
    required: true
  },
 
  name:{
    type:String,
    required:true

  },
  date:{
type:String,
required:true

  },
  phone:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required: true

  },
   
  
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('booking', BookingSchema);
