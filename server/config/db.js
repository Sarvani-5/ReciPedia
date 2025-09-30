const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options - Mongoose 6+ handles these automatically
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('='.repeat(50));
    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState}`);
    console.log('='.repeat(50));

    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

  } catch (error) {
    console.error('='.repeat(50));
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    // Specific error details
    if (error.name === 'MongoServerError') {
      console.error('Server Error Code:', error.code);
    }
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    
    console.error('Full Error:', error);
    console.error('='.repeat(50));
    
    process.exit(1);
  }
};

module.exports = connectDB;