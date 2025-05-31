import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { initializeDB } from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [process.env.FRONTEND_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like Postman) or allowed frontend
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Optional: only if you're sending cookies or auth headers from frontend
}));
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