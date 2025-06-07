const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
  agencyName: {
    type: String,
    required: true,
  },
  period: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  cost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'denied'],
    default: 'pending',
  },
  phone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
