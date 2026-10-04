const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MONGODB_URI in the .env file.');
    console.error('The server will continue running but database operations will fail.');
    // Don't exit — let the server run so frontend can load
  }
};

module.exports = connectDB;
