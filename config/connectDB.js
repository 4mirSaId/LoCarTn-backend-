const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose. It exports a function that attempts to connect to the database using the URI stored in the environment variable MONGO_URI. If the connection is successful, it logs "MongoDB connected" to the console. If there is an error, it logs the error and exits the process with a failure code (1). The function uses async/await syntax for better readability and error handling.