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
            user: req.user.id,
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
const getVisitById = async (req, res) => {};

export { getVisitsByPatient, getVisitById };