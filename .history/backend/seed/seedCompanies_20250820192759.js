const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser'); // install with: npm install csv-parser
const Company = require('../models/Company');

// 🔹 Change this to your MongoDB connection string
const MONGO_URI = 'mongodb://127.0.0.1:27017/fincapital';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function seedCompanies() {
  try {
    const results = [];

    fs.createReadStream('./data.csv') // make sure data.csv is inside backend/
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        console.log(`Read ${results.length} rows from CSV.`);

        // Optional: clear existing companies before inserting
        await Company.deleteMany({});

        // Insert all rows
        await Company.insertMany(results);
        console.log('✅ Companies data inserted successfully');

        mongoose.connection.close();
      });
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    mongoose.connection.close();
  }
}

seedCompanies();
