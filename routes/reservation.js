const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Client creates a reservation for a specific car
router.post('/:carId', authMiddleware(['client']), reservationController.createReservation);

// Client gets their reservations
router.get('/client', authMiddleware(['client']), reservationController.getClientReservations);

// Agency gets reservations for their cars
router.get('/agency', (req, res, next) => {
  console.log('HEADERS:', req.headers);
  next();
}, authMiddleware(['agency']), reservationController.getAgencyReservations);

// Agency updates reservation status
router.patch('/:reservationId/status', (req, res, next) => {
  console.log('PATCH STATUS HEADERS:', req.headers);
  console.log('PATCH STATUS BODY:', req.body);
  next();
}, authMiddleware(['agency']), reservationController.updateReservationStatus);

module.exports = router;
