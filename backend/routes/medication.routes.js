const router = require('express').Router();
const MedicationPlan = require('../models/medicationPlan.model');
const Medication = require('../models/medication.model');
const Patient = require('../models/patient.model');

// --- Placeholder for Drug Interaction Logic ---
// In a real application, this would involve a complex rules engine
// and a comprehensive drug database.
async function checkDrugInteractions(newMedication, patientId) {
    console.log(`Checking for interactions with new medication: ${newMedication.name} for patient: ${patientId}`);

    // 1. Get all active medications for the patient.
    const activePlans = await MedicationPlan.find({ patient: patientId, isActive: true }).populate('medication');
    const activeMedications = activePlans.map(plan => plan.medication);

    // 2. Simulate an interaction check.
    // This is a very basic simulation. A real implementation would be far more complex.
    // For example, let's pretend "Warfarin" and "Aspirin" interact.
    const hasWarfarin = activeMedications.some(med => med.name.toLowerCase().includes('warfarin'));
    const newMedIsAspirin = newMedication.name.toLowerCase().includes('aspirin');

    if (hasWarfarin && newMedIsAspirin) {
        return { interaction: true, message: "Critical interaction detected: Warfarin and Aspirin should not be taken together." };
    }

    // No interaction found in this basic check.
    return { interaction: false };
}


// @route   GET /api/medications
// @desc    Get all medication plans (populated with patient and medication details)
// @access  Public
router.route('/').get((req, res) => {
    MedicationPlan.find()
        .populate('patient', 'name') // Populate patient with just the name field
        .populate('medication')    // Populate all medication details
        .then(plans => res.json(plans))
        .catch(err => res.status(400).json('Error: ' + err));
});


// @route   POST /api/medications/add
// @desc    Add a new medication plan
// @access  Public
router.route('/add').post(async (req, res) => {
    const { patientId, medicationName, dosage, type, ingredients, schedule } = req.body;

    // Basic validation
    if (!patientId || !medicationName || !dosage || !type || !schedule) {
        return res.status(400).json('Error: Please provide all required fields.');
    }

    try {
        // For simplicity, we'll find or create the patient and medication.
        // In a real app, you might have separate dedicated endpoints for creating patients/meds.
        let patient = await Patient.findById(patientId);
        if (!patient) {
            // For this example, we'll create a new patient if not found.
            // This is just for demonstration; you might want different logic.
            patient = new Patient({ _id: patientId, name: 'New Patient ' + patientId });
            await patient.save();
        }

        let medication = await Medication.findOne({ name: medicationName });
        if (!medication) {
            medication = new Medication({ name: medicationName, dosage, type, ingredients });
            await medication.save();
        }

        // *** Perform Drug Interaction Check ***
        const interactionResult = await checkDrugInteractions(medication, patient._id);
        if (interactionResult.interaction) {
            // If an interaction is found, return a warning and do not create the plan.
            return res.status(409).json({ message: 'Interaction Detected', error: interactionResult.message });
        }

        // If no interaction, create the new medication plan.
        const newPlan = new MedicationPlan({
            patient: patient._id,
            medication: medication._id,
            schedule,
        });

        await newPlan.save();
        res.json({ message: 'Medication plan added successfully!', plan: newPlan });

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;
