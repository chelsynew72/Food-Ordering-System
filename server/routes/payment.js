import { Router } from 'express';
import { initiatePayment, payhereNotify, getPaymentSummary, simulatePayment } from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/initiate', protect, initiatePayment);
router.post('/notify', payhereNotify);            // Public — called by PayHere server
router.get('/summary', protect, adminOnly, getPaymentSummary);

export default router;
