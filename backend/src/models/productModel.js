// src/models/productModel.js
import pool from '../config/db.js';

export const getAll = async () => {
  const res = await pool.query('SELECT * FROM products');
  return res.rows;
};

export const getById = async (id) => {
  const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0];
};

export const create = async ({ title, description, price, image_url, variant_options, inventory }) => {
  const res = await pool.query(
    `INSERT INTO products (title, description, price, image_url, variants, inventory)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, price, image_url, variant_options, inventory]
  );
  return res.rows[0];
};

export const decrementInventory = async (id, qty) => {
  await pool.query('UPDATE products SET inventory = inventory - $1 WHERE id = $2', [qty, id]);
};
