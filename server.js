const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const connectDB = require ('./config/connectDB');
dotenv.config();

connectDB();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// check if cloudinary is reached
// const cloudinary = require('./config/cloudinary');

// app.get('/api/cloudinary-test', async (req, res) => {
//   try {
//     // This will fetch your Cloudinary account details
//     const result = await cloudinary.api.ping();
//     res.json({ success: true, result });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// Import routes



app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', JSON.stringify(err, null, 2));
  res.status(500).json({
    message: 'Internal server error',
    error: typeof err === 'object' ? JSON.stringify(err, null, 2) : err
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});