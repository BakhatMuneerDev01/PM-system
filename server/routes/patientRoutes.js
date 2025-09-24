import express from 'express';
import {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// All patient routes require authentication
router.use(protect);
// Routes
router.route('/')
    .get(getPatients)
    .post(createPatient);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

export default router;
