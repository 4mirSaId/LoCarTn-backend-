const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const connectDB = require ('./config/connectDB');
dotenv.config();

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// Import routes

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});