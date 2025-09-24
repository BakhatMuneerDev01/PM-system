import mongoose from "mongoose";
const visitSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    summary: { type: String },
    type: { type: String, enum: ['Initial Consultation', 'Follow-up', 'Emergency', 'Routine Check-up'], required: true },
    gpsLocation: { latitude: { type: Number }, longitude: { type: Number } },
    notes: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitNote' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Visit = mongoose.model("Visit", visitSchema);
export default Visit;