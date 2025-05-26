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
  },
  agency: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  isRented: {
    type: Boolean,
    default: false
  },
}, {timestamps: true})

module.exports = mongoose.model('Car', carSchema)