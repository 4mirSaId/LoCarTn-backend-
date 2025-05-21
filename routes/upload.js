const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { addCar } = require('../controllers/carController');

router.post('/upload', upload.single('image'), addCar);


module.exports = router;