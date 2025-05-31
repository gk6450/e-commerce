// src/controllers/productController.js
import * as productModel from '../models/productModel.js';

export const listProducts = async (req, res, next) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, image_url, variant_options, inventory } = req.body;

    const product = await productModel.create({
      title,
      description,
      price,
      image_url,
      variant_options,
      inventory
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}
