const car = require('../models/car');

const addCar = async (req, res) => {
    try {
        const { brand, model, year, pricePerDay, caution, agency } = req.body;
        const imageUrl = req.file?.path; // Assuming the image URL is stored in req.file.path

        const newCar = new car({
            brand,
            model,
            year,
            pricePerDay,
            caution,
            imageUrl,
            agency: req.user._id
        });

        await newCar.save();
        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add car' });
    }
};

module.exports = {
    addCar
};