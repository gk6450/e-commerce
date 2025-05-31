import { Router } from 'express';
import { listProducts, createProduct, getProductById } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);

export default router;