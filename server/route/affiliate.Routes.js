// affiliate.Routes.js
import express from 'express';
import affiliateController from '../controllers/affiliate.Controller.js';

const router = express.Router();

router.post('/create-order', affiliateController.createOrder);
router.post('/verify-payment', affiliateController.verifyPayment);

export default router;
