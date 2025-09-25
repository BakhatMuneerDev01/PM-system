import Patient from '../models/Patient.js';
import Visit from '../models/Visit.js';
/**
 * Get all patients with search, sort, and pagination
 * @route GET /api/patients
 * @access Private
 */
const getPatients = async (req, res) => {
    try {
        const { search, sortBy = 'fullName', sortOrder = 'asc', page = 1, limit = 10 } = req.query;
        // Build search qurey
        let query = { user: req.user._id };

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ]
        }
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        // Execute query with pagination
        const patients = await Patient.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        // Get total count for pagination
        const total = await Patient.countDocuments(query);
        res.json({
            patients,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalPatients: total,
                hasNextPage: skip + patients.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Get patients error:', error.message);
        res.status(500).json({ message: 'Server error getting patients' });
    }
}
/**
 * Get single patient by ID
 * @route GET /api/patients/:id
 * @access Private
 */
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (patient) {
            const recentVisits = await Visit.findOne({ patient: patient._id })
                .sort({ date: -1 })
                .limit(5)
                .populate('notes');
            res.json({
                ...patient.toObject(),
                recentVisits
            })
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Get patient error:', error.message);
        res.status(500).json({ message: 'Server error getting patient' });
    }
};
/**
 * Create new patient
 * @route POST /api/patients
 * @access Private
 */
const createPatient = async (req, res) => {
    try {
        const { fullName, phoneNumber, address, dateOfBirth, emergencyContact } = req.body;
        // Basic valedation
        if (!fullName || !phoneNumber || !address) {
            return res.status(400).json({ message: 'Please provide full name, phone number' });
        };
        // Check if patient with same phone number already exists for this user
        const existingPatient = await Patient.findOne({
            phoneNumber,
            user: req.user._id,
        })

        if (existingPatient) {
            return res.status(400).json({ message: 'Patient with this phone number already exists' });
        }
        // Create new patient
        const patient = new Patient({
            fullName,
            phoneNumber,
            address,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            emergencyContact,
            user: req.user._id
        });
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error('Create patient error:', error.message);
        res.status(500).json({ message: 'Server error creating patient' });
    }
}
/**
 * Update patient
 * @route PUT /api/patients/:id
 * @access Private
 */
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            user: req.user._id,
        })

        if (patient) {
            // Update patient fields
            patient.fullName = req.body.fullName || patient.fullName;
            patient.phoneNumber = req.body.phoneNumber || patient.phoneNumber;
            patient.address = req.body.address || patient.address;

            if (req.body.dateOfBirth) {
                patient.dateOfBirth = new Date(req.body.dateOfBirth);
            }

            if (req.body.emergencyContact) {
                patient.emergencyContact = {
                    ...patient.emergencyContact,
                    ...req.body.emergencyContact,
                }
            }

            const updatedPatient = await patient.save();
            res.json(updatedPatient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Update patient error:', error.message);
        res.status(500).json({ message: 'Server error updating patient' });
    }
};
/**
 * Delete patient
 * @route DELETE /api/patients/:id
 * @access Private
 */
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (patient) {
            // Also delete associated visits and visit notes
            await Visit.deleteMany({ patient: patient._id });
            await patient.deleteOne();

            res.json({ message: 'Patient and associated data removed successfully' });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Delete patient error:', error.message);
        res.status(500).json({ message: 'Server error deleting patient' });
    }
};
export { getPatients, getPatientById, createPatient, updatePatient, deletePatient };