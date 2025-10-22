// import express from 'express';
// import {
//     getVisitsByPatient,
//     getVisitById,
//     createVisit,
//     updateVisit,
//     deleteVisit
// } from '../controllers/visitController.js';
// import {
//     createOrUpdateVisitNotes,
//     getVisitNotes,
//     deleteVisitNotes
// } from '../controllers/visitNoteController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();
// // All visit routes require authentication
// router.use(protect);
// // Visit routes
// router.route('/')
//     .post(createVisit);

// router.route('/:id')
//     .get(getVisitById)
//     .put(updateVisit)
//     .delete(deleteVisit);

// router.route('/patient/:patientId')
//     .get(getVisitsByPatient);
// // Visit notes routes
// router.route('/:visitId/notes')
//     .get(getVisitNotes)
//     .post(createOrUpdateVisitNotes)
//     .delete(deleteVisitNotes);// Add this route to your visitRoutes.js

// export default router;

import express from 'express';
import {
    getVisitsByPatient,
    getVisitById,
    createVisit,
    updateVisit,
    deleteVisit,
    deleteAllVisitsForPatient // Add this import
} from '../controllers/visitController.js'; // You'll need to create this function
import {
    createOrUpdateVisitNotes,
    getVisitNotes,
    deleteVisitNotes
} from '../controllers/visitNoteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All visit routes require authentication
router.use(protect);

// Visit routes
router.route('/')
    .post(createVisit);

router.route('/:id')
    .get(getVisitById)
    .put(updateVisit)
    .delete(deleteVisit);

router.route('/patient/:patientId')
    .get(getVisitsByPatient)
    .delete(deleteAllVisitsForPatient); // Add this route

// Visit notes routes
router.route('/:visitId/notes')
    .get(getVisitNotes)
    .post(createOrUpdateVisitNotes)
    .delete(deleteVisitNotes);

export default router;