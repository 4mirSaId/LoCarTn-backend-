const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all agencies (admin only)
router.get('/agencies', authMiddleware(['admin']), adminController.getAllAgencies);

// Get all clients (admin only)
router.get('/clients', authMiddleware(['admin']), adminController.getAllClients);

// Get all reservations (admin only)
router.get('/reservations', authMiddleware(['admin']), adminController.getAllReservations);

// Delete an agency and all its cars (admin only)
router.delete('/agencies/:agencyId', authMiddleware(['admin']), adminController.deleteAgencyAndCars);

// Get cars by agency (admin only)
router.get('/agencies/:agencyId/cars', authMiddleware(['admin']), adminController.getCarsByAgency);

module.exports = router;
