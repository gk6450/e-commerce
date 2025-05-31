import { Router } from 'express';
import { checkout, getOrder, listOrders } from '../controllers/orderController.js';

const router = Router();

router.post('/checkout', checkout);
router.get('/:order_number', getOrder);
router.get('/', listOrders);

export default router;
