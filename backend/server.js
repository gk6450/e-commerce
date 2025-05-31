import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { initializeDB } from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Initialize DB and start server
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Could not start server due to DB init failure', err);
});