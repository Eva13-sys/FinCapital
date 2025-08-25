import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Company from '../models/Company.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seedCompanies() {
  try {
    const results = [];

    fs.createReadStream(new URL('./data/data.csv', import.meta.url)) 
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        console.log(`Read ${results.length} rows from CSV.`);

        await Company.deleteMany({});
        await Company.insertMany(results);

        console.log('Companies data inserted successfully');
        mongoose.connection.close();
      });
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  }
}

seedCompanies();
