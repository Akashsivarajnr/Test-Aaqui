const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
    
    // Auto-provision default authority admin account if missing or update password
    const User = require('../models/User');
    const defaultEmail = 'authority@platform.com';
    const defaultPass = 'admin123';
    let defaultUser = await User.findOne({ email: defaultEmail });
    if (!defaultUser) {
      const passwordHash = await User.hashPassword(defaultPass);
      defaultUser = await User.create({ name: 'Platform Authority', email: defaultEmail, passwordHash, role: 'superadmin' });
      console.log(`[db] Created default authority admin: ${defaultEmail}`);
    } else {
      defaultUser.passwordHash = await User.hashPassword(defaultPass);
      await defaultUser.save();
    }
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
}

module.exports = connectDB;
