const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  esgScore: { type: Number, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  environmental: { type: Boolean, default: false },
  womenLed: { type: Boolean, default: false },
  topGovernance: { type: Boolean, default: false },
  impact: { type: [String], default: [] },
});

module.exports = mongoose.model('Company', companySchema);
