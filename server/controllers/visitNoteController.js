import VisitNote from '../models/VisitNote.js';
import Visit from '../models/Visit.js';
import Patient from '../models/Patient.js';
/**
 * Create or update visit notes
 * @route POST /api/visits/:visitId/notes
 * @access Private
 */
const createOrUpdateVisitNotes = async (req, res) => {
    try {
        const { observations, treatmentNotes, followUpInstructions } = req.body;
        const visitId = req.params.visitId;
        // Find the visit and verify ownership
        const visit = await Visit.findById(visitId).populate('patient');
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        };
        // Verify the visit's patient belongs to the authenticated user
        const patient = await Patient.findOne({
            _id: visit.patient._id,
            user: req.user._id
        });
        if (!patient) {
            return res.status(403).json({ message: 'Not authorized to access this visit' });
        };
        let visitNote;
        // Check if visit notes already exist
        if (visit.notes) {
            // Update existing notes
            visitNote = await VisitNote.findById(visit.notes);
            if (visitNote) {
                visitNote.observations = observations || visitNote.observations;
                visitNote.treatmentNotes = treatmentNotes || visitNote.treatmentNotes;
                visitNote.followUpInstructions = followUpInstructions || visitNote.followUpInstructions;
                await visitNote.save();
            }
        } else {
            // Create new notes
            visitNote = await VisitNote.create({
                visit: visitId,
                observations,
                treatmentNotes,
                followUpInstructions,
                user: req.user._id
            });
            visit.notes = visitNote._id;
            await visit.save();
        }
    } catch (error) {
        console.error('Create/Update visit notes error:', error.message);
        res.status(500).json({ message: 'Server error managing visit notes' });
    }
}
/**
 * Get visit notes by visit ID
 * @route GET /api/visits/:visitId/notes
 * @access Private
 */
const getVisitNotes = async (req, res) => {
    try {
        const visitId = req.params.visitId;
        // Find the visit and verify ownership
        const visit = await Visit.findById(visitId).populate('patient');
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        // Verify the visit's patient belongs to the authenticated user
        const patient = await Patient.findOne({
            _id: visit.patient._id,
            user: req.user._id
        });
        if (!patient) {
            return res.status(403).json({ message: 'Not authorized to access this visit' });
        }

        if (!visit.notes) {
            return res.status(404).json({ message: 'No notes found for this visit' });
        }

        const visitNote = await VisitNote.findById(visit.notes);

        if (!visitNote) {
            return res.status(404).json({ message: 'Visit notes not found' });
        }

        res.json(visitNote);
    } catch (error) {
        console.error('Get visit notes error:', error.message);
        res.status(500).json({ message: 'Server error getting visit notes' });
    }
}
/**
 * Delete visit notes
 * @route DELETE /api/visits/:visitId/notes
 * @access Private
 */
const deleteVisitNotes = async (req, res) => {
    try {
        const visitId = req.params.visitId;
        // Find the visit and verify ownership
        const visit = await Visit.findById(visitId).populate('patient');
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        // Verify the visit's patient belongs to the authenticated user
        const patient = await Patient.findOne({
            _id: visit.patient._id,
            user: req.user._id
        });

        if (!patient) {
            return res.status(403).json({ message: 'Not authorized to access this visit' });
        }
        if (!visit.notes) {
            return res.status(404).json({ message: 'No notes found for this visit' });
        }

        // Delete the visit notes
        await VisitNote.findByIdAndDelete(visit.notes);
        // Remove the reference from the visit
        visit.notes = undefined;
        await visit.save();

        res.json({ message: 'Visit notes deleted successfully' });
    } catch (error) {
        console.error('Delete visit notes error:', error.message);
        res.status(500).json({ message: 'Server error deleting visit notes' });
    }
}

export {
    createOrUpdateVisitNotes,
    getVisitNotes,
    deleteVisitNotes
}