import mongoose from 'mongoose';
const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});
const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    lastVisit: { type: Date },
    dateOfBirth: { type: Date },
    emergencyContact: EmergencyContactSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;