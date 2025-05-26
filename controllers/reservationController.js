const Reservation = require('../models/Reservation');
const Car = require('../models/car');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    // carId should come from the route, not the body
    const carId = req.params.carId;
    const { from, to } = req.body;
    const clientId = req.user.id;
    // Get phone from client data (assume req.user.phone)
    const phone = req.user.phone;
    console.log('Reservation create request:', { carId, from, to, clientId, phone: req.user?.phone });
    if (!carId || !from || !to || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (fromDate > toDate) {
      return res.status(400).json({ message: 'Invalid period interval' });
    }
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
    const cost = car.pricePerDay * days;
    const reservation = new Reservation({
      carId,
      clientId,
      period: { from: fromDate, to: toDate },
      cost,
      status: 'pending',
      phone,
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
};

// Get reservations for a client
exports.getClientReservations = async (req, res) => {
  try {
    const clientId = req.user.id;
    const reservations = await Reservation.find({ clientId }).populate('carId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Get reservations for an agency's cars
exports.getAgencyReservations = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const cars = await Car.find({ agency: agencyId });
    const carIds = cars.map(car => car._id);
    const reservations = await Reservation.find({ carId: { $in: carIds } }).populate('carId clientId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Update reservation status (agency only)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;
    if (!['pending', 'confirmed', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error: error.message });
  }
};
