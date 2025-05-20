const express = require('express');
const Car = require('../models/car');
const router = express.Router();
const {authMiddleware, isAgency} = require('../middleware/authMiddleware');
const Agency = require('../models/Agency');

// add a new car
// only agency can add a car
router.post('/', authMiddleware, isAgency, async (req, res) => {
  try {
    const {model, brand, year, pricePerDay, imageUrl} = req.body;
    const car = new Car({
      model,
      brand,
      year,
      pricePerDay,
      imageUrl,
      agency: req.user._id
    });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// get cars by agency
// only agency can get their cars
// this is used to show the cars in the agency dashboard
router.get('/agency/:agencyId', authMiddleware, isAgency, async (req, res) => {
  try {
    const cars = await Car.find({agency: req.params.agencyId});
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// delete a car
router.delete('/:id', authMiddleware, isAgency, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, agency: req.user._id });
    if (!car) {
      return res.status(404).json({ error: 'Car not found or not authorized' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updating car price
router.patch('/:id/price', authMiddleware, isAgency, async (req, res) => {
  try {
    const { pricePerDay } = req.body;
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, agency: req.user._id },
      { pricePerDay },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ error: 'Car not found or not authorized' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get all cars
// this is used to show the cars in the home page
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('agency', 'name');
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;

