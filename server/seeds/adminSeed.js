const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tce.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@TCE2024';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      process.exit(0);
    }

    // Create admin user
    await User.create({
      fullName: 'TCE Administrator',
      collegeId: 'ADMIN001',
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'admin',
      department: 'Other',
      year: 'Alumni',
      phone: '0000000000'
    });

    console.log('Admin account created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: [as set in .env ADMIN_PASSWORD]');

    process.exit(0);
  } catch (error) {
    console.error('Admin seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
