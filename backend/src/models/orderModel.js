import pool from '../config/db.js';

export const create = async (orderData) => {
  const {
    order_number, full_name, email, phone,
    address, city, state, zip, status,
    items // array of { product_id, variant, quantity }
  } = orderData;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert into orders table
    const orderRes = await client.query(
      `INSERT INTO orders 
        (order_number, full_name, email, phone, address, city, state, zip, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [order_number, full_name, email, phone, address, city, state, zip, status]
    );
    const order = orderRes.rows[0];

    // Insert each item into order_items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, variant, quantity)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.variant, item.quantity]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getByOrderNumber = async (order_number) => {
  const res = await pool.query(
    `SELECT o.*, oi.product_id, oi.variant, oi.quantity, p.title, p.price
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON oi.product_id = p.id
     WHERE o.order_number = $1`,
    [order_number]
  );

  if (res.rows.length === 0) return null;

  const { id, order_number: num, full_name, email, phone, address, city, state, zip, status, created_at } = res.rows[0];

  const items = res.rows.map(row => ({
    product_id: row.product_id,
    title: row.title,
    price: row.price,
    variant: row.variant,
    quantity: row.quantity,
  }));

  return {
    id,
    order_number: num,
    full_name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    status,
    created_at,
    items,
  };
};

export const getAll = async () => {
  const res = await pool.query(`
    SELECT o.*, 
           json_agg(
             json_build_object(
               'product_id', oi.product_id,
               'variant', oi.variant,
               'quantity', oi.quantity,
               'title', p.title,
               'price', p.price
             )
           ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  return res.rows;
};
