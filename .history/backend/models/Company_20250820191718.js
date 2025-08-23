const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  ticker: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  currency: { type: String },
  exchange: { type: String },
  industry: { type: String },
  logo: { type: String }, // logo url
  weburl: { type: String },

  // ESG breakdown
  environment_grade: { type: String },
  environment_level: { type: String },
  social_grade: { type: String },
  social_level: { type: String },
  governance_grade: { type: String },
  governance_level: { type: String },

  // ESG scores
  environment_score: { type: Number },
  social_score: { type: Number },
  governance_score: { type: Number },
  total_score: { type: Number },

  // Extra info
  last_processing_date: { type: Date },
  total_grade: { type: String },
  total_level: { type: String },
  cik: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
