import { v4 as uuidv4 } from 'uuid';
import * as productModel from '../models/productModel.js';
import * as orderModel from '../models/orderModel.js';
import * as emailService from '../utils/emailService.js';

const simulateTransaction = () => {
  const outcomes = ['approved', 'declined', 'error'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

export const checkout = async (req, res, next) => {
  try {
    const {
      full_name, email, phone, address, city, state, zip,
      card_number, expiry, cvv, items // array of { product_id, variant, quantity }
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const enrichedItems = [];

    for (const item of items) {
      const product = await productModel.getById(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      enrichedItems.push({
        product_id: item.product_id,
        variant: item.variant,
        quantity: item.quantity,
        title: product.title,
        price: product.price,
      });

      if (product.inventory < item.quantity) {
        return res.status(400).json({ error: `Insufficient inventory for product ${product.title}` });
      }
    }

    const status = simulateTransaction();
    const order_number = uuidv4();

    const order = await orderModel.create({
      order_number, full_name, email, phone, address, city, state, zip, status, items
    });

    if (status === 'approved') {
      for (const item of items) {
        await productModel.decrementInventory(item.product_id, item.quantity);
      }
    }

    // Optional: send confirmation email
    await emailService.sendOrderEmail(order, enrichedItems, status);

    res.json({ order_number, status });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { order_number } = req.params;
    const order = await orderModel.getByOrderNumber(order_number);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};


export const listOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
