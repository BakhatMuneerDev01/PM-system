import Visit from '../models/Visit.js';
import VisitNote from '../models/VisitNote.js';
import Patient from '../models/Patient.js';
/**
 * Get all visits for a specific patient
 * @route GET /api/visits/patient/:patientId
 * @access Private
 */
const getVisitsByPatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.patientId,
            user: req.user._id,
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        const visits = await Visit.find({
            patient: req.params.patientId
        })
            .sort({ date: -1 })
            .populate('notes')
            .populate('patient', 'fullName phoneNumber');
        res.json(visits);
    } catch (error) {
        console.error('Get visits error:', error.message);
        res.status(500).json({ message: 'Server error getting visits' });
    }
};

/**
 * Get single visit by ID
 * @route GET /api/visits/:id
 * @access Private
 */
const getVisitById = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('patient', 'fullName phoneNumber address dateOfBirth emergencyContact')
            .populate('notes')
            .populate('user', 'username email');

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
        res.json(visit);
    } catch (error) {
        console.error('Get visit error:', error.message);
        res.status(500).json({ message: 'Server error getting visit' });
    }
};
/**
 * Create new visit
 * @route POST /api/visits
 * @access Private
 */
const createVisit = async (req, res) => {
    try {
        const { patient, date, purpose, summary, type, gpsLocation, notes } = req.body;
        // Basic validation
        if (!patient || !date || !purpose || !type) {
            return res.status(400).json({ message: 'Please provide patient, date, purpose, and type' });
        }
        // Verify patient belongs to authenticated user
        const patientDoc = await Patient.findOne({
            _id: patient,
            user: req.user._id,
        });

        if (!patientDoc) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const visit = new Visit({
            patient,
            date: new Date(date),
            purpose,
            summary,
            type,
            gpsLocation,
            user: req.user._id
        })
        await visit.save();
        // Update patient's lastVisit field
        patientDoc.lastVisit = new Date(date);
        await patientDoc.save();
        // If notes are provided, create visit notes
        if (notes && (notes.observations || notes.treatmentNotes || notes.followUpInstructions)) {
            const visitNote = await VisitNote.create({
                visit: visit._id,
                observations: notes.observations,
                treatmentNotes: notes.treatmentNotes,
                followUpInstructions: notes.followUpInstructions,
                user: req.user._id,
            });

            visit.notes = visitNote._id;
            await visit.save();
        }

        const populatedVisit = await Visit.findById(visit._id)
            .populate('patient', 'fullName phoneNumber')
            .populate('notes');

        res.status(201).json(populatedVisit);
    } catch (error) {
        console.error('Create visit error:', error.message);
        res.status(500).json({ message: 'Server error creating visit' });
    }
};
/**
 * Update visit
 * @route PUT /api/visits/:id
 * @access Private
 */
const updateVisit = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        // Update visit fields
        visit.date = req.body.date ? new Date(req.body.date) : visit.date;
        visit.purpose = req.body.purpose || visit.purpose;
        visit.summary = req.body.summary || visit.summary;
        visit.type = req.body.type || visit.type;
        visit.gpsLocation = req.body.gpsLocation || visit.gpsLocation;

        const updatedVisit = await visit.save();

        const populatedVisit = await Visit.findById(updatedVisit._id)
            .populate('patient', 'fullName phoneNumber')
            .populate('notes');

        res.json(populatedVisit);
    } catch (error) {
        console.error('Update visit error:', error.message);
        res.status(500).json({ message: 'Server error updating visit' });
    }
}
/**
 * Delete visit
 * @route DELETE /api/visits/:id
 * @access Private
 */
const deleteVisit = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        // Verify the visit's patient belongs to the authenticated user
        const patient = await Patient.findOne({
            _id: visit.patient,
            user: req.user._id
        });
        if (!patient) {
            return res.status(403).json({ message: 'Not authorized to delete this visit' });
        }
        // Delete associated visit notes
        if (visit.notes) {
            await VisitNote.findByIdAndDelete(visit.notes);
        }
        await visit.deleteOne();

        res.json({ message: 'Visit and associated notes removed successfully' });
    } catch (error) {
        console.error('Delete visit error:', error.message);
        res.status(500).json({ message: 'Server error deleting visit' });
    }
}

/**
 * Delete all visits for a specific patient
 * @route DELETE /api/visits/patient/:patientId
 * @access Private
 */
const deleteAllVisitsForPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify patient belongs to authenticated user
        const patient = await Patient.findOne({
            _id: patientId,
            user: req.user._id,
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Find all visits for this patient
        const visits = await Visit.find({ patient: patientId });

        // Delete all associated visit notes and visits
        for (const visit of visits) {
            if (visit.notes) {
                await VisitNote.findByIdAndDelete(visit.notes);
            }
            await Visit.findByIdAndDelete(visit._id);
        }

        // Update patient's lastVisit field
        patient.lastVisit = undefined;
        await patient.save();

        res.json({
            message: 'All visits deleted successfully',
            deletedCount: visits.length
        });
    } catch (error) {
        console.error('Delete all visits error:', error.message);
        res.status(500).json({ message: 'Server error deleting visits' });
    }
};

export { getVisitsByPatient, getVisitById, createVisit, updateVisit, deleteVisit, deleteAllVisitsForPatient };