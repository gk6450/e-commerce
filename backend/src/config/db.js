import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.AVN_USER,
    password: process.env.AVN_PASS,
    host: process.env.AVN_HOST,
    port: process.env.AVN_PORT,
    database: process.env.AVN_DB,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString()
    }
});

export default pool;

export async function initializeDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      -- Drop existing tables if they exist
      --DROP TABLE IF EXISTS order_items;
      --DROP TABLE IF EXISTS orders;
      --DROP TABLE IF EXISTS products;

      -- Create products table if not exists
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        price NUMERIC(10, 2) NOT NULL,
        inventory INTEGER NOT NULL DEFAULT 0,
        variants JSONB DEFAULT '{}'
      );

      -- Create orders table if not exists
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number UUID UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('approved', 'declined', 'error')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create order_items table if not exists
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        variant JSONB,
        quantity INTEGER NOT NULL
      );
    `);

    console.log('✅ Database initialized (all tables dropped and recreated).');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    client.release();
  }
}