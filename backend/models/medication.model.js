const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['western', 'tcm']
  },
  // Specifically for TCM, can list herbal ingredients
  ingredients: {
    type: [String],
    default: undefined // Use undefined so the field is not created for western meds
  }
}, {
  timestamps: true,
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;
