const Agency = require('../models/Agency');
const Client = require('../models/Client');
const Reservation = require('../models/Reservation');

// Get all agencies (admin only)
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agencies', error: error.message });
  }
};

// Get all clients (admin only)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

// Get all reservations (admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('carId clientId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Delete an agency and all its cars (admin only)
exports.deleteAgencyAndCars = async (req, res, next) => {
  try {
    const agencyId = req.params.agencyId;
    const Car = require('../models/car');
    await Car.deleteMany({ agency: agencyId });
    const Agency = require('../models/Agency');
    const result = await Agency.findByIdAndDelete(agencyId);
    if (!result) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.json({ message: 'Agency and all its cars deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get cars by agency (admin only)
exports.getCarsByAgency = async (req, res, next) => {
  try {
    const agencyId = req.params.agencyId;
    const Car = require('../models/car');
    const cars = await Car.find({ agency: agencyId });
    res.json(cars);
  } catch (error) {
    next(error);
  }
};
