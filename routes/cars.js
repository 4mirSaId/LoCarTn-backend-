const express = require('express');
const Car = require('../models/car');
const { authMiddleware, isAgency } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Create a new car
router.post('/', (req, res, next) => {
  console.log('Incoming add car request');
  next();
}, authMiddleware(['agency']), isAgency, upload.single('image'), async (req, res) => {
    try {
        const { model, brand, year, pricePerDay, caution, location } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const newCar = new Car({
            model,
            brand,
            year,
            pricePerDay,
            caution,
            location,
            imageUrl,
            agency: req.user.id // use id from JWT, not _id
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        console.error('Error creating car:', JSON.stringify(error, null, 2));
        res.status(500).json({
            message: 'Error creating car',
            error: typeof error === 'object' ? JSON.stringify(error, null, 2) : error
        });
    }
});

// get cars by agency
router.get('/agency/:agencyId', authMiddleware(['agency']), isAgency, async (req, res) => {
    try {
        if (!req.params.agencyId || req.params.agencyId === 'undefined') {
            return res.status(400).json({ message: 'Missing or invalid agencyId' });
        }
        const cars = await Car.find({ agency: req.params.agencyId });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
        console.error('Error fetching cars:', error.stack || error.message);
    }
});

// delete a car
router.delete('/:id', authMiddleware(['agency']), isAgency, async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error: error.message });
        console.error('Error deleting car:', error.stack || error.message);
    }
});

// update a car price
router.patch('/:id/price', authMiddleware(['agency']), isAgency, async (req, res) => {
    try {
        const { pricePerDay } = req.body;
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { pricePerDay },
            { new: true }
        );
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: 'Error updating car price', error: error.message });
        console.error('Error updating car price:', error.stack || error.message);
    }
});

// get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
        console.error('Error fetching cars:', error.stack || error.message);
    }
});

module.exports = router;