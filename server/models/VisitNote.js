import mongoose from "mongoose";
const visitNoteSchema = new mongoose.Schema({
    visit: {type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: ture},
    observations: {type: String},
    treatmentNotes: {type: String},
    followUpInstructions: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});
const VisitNote = mongoose.model("VisitNote", visitNoteSchema);
export default VisitNote;