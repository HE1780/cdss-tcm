const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicationPlanSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medication: {
    type: Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  schedule: {
    type: String,
    required: true,
    trim: true,
    // e.g., "Once a day in the morning", "Twice a day with meals"
  },
  // To track adherence
  dosesTaken: {
    type: [Date],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

const MedicationPlan = mongoose.model('MedicationPlan', medicationPlanSchema);

module.exports = MedicationPlan;
