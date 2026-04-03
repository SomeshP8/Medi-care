require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Record = require('./models/Record');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medchain')
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    
    // Clear DB
    await User.deleteMany({});
    await Record.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    const doctor = await User.create({
      name: 'Dr. Smith',
      email: 'doctor@medchain.com',
      password: passwordHash,
      healthId: 'doc-hash-1',
      role: 'doctor',
      emergencyInfo: { bloodGroup: 'O+', allergies: [], medications: [] }
    });

    const patient = await User.create({
      name: 'John Patient',
      email: 'patient@medchain.com',
      password: passwordHash,
      healthId: 'pat-hash-1',
      role: 'patient',
      emergencyInfo: { bloodGroup: 'A+', allergies: ['Penicillin'], medications: [] }
    });

    await Record.create([
      {
        userId: patient._id,
        doctorName: doctor.name,
        notes: 'Annual checkup, everything looks normal.',
        fileUrl: '/uploads/dummy1.pdf',
        recordHash: 'hash1'
      },
      {
        userId: patient._id,
        doctorName: doctor.name,
        notes: 'Follow-up for slight high blood pressure.',
        fileUrl: '/uploads/dummy2.pdf',
        recordHash: 'hash2'
      }
    ]);

    console.log('Database seeded successfully: 1 doctor, 1 patient, 2 records.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
