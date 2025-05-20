const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const carSchema = new Schema({
  model: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('Car', carSchema)