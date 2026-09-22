const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Helper to generate the next auto-increment ID
const generateNextId = async () => {
  // Sort by id descending to get the highest ID
  const lastProduct = await Product.findOne().sort({ id: -1 });
  let nextNum = 1;
  if (lastProduct && lastProduct.id && lastProduct.id.startsWith('MBE-')) {
    const numPart = parseInt(lastProduct.id.split('-')[1], 10);
    if (!isNaN(numPart)) {
      nextNum = numPart + 1;
    }
  }
  return `MBE-${nextNum.toString().padStart(3, '0')}`;
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, category, description, price, size, image } = req.body;
    let { id } = req.body;

    // If ID is not provided, generate the next auto-increment ID
    if (!id) {
      id = await generateNextId();
    } else {
      const productExists = await Product.findOne({ id });
      if (productExists) {
        return res.status(400).json({ message: 'Product with this ID already exists' });
      }
    }

    const product = new Product({
      id, name, category, description, price, size, image
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk create products
router.post('/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products should be an array' });
    }

    let addedCount = 0;
    let updatedCount = 0;
    let invalidCount = 0;

    for (const p of products) {
      const { name, category = 'Uncategorized', description = 'No description provided', price = 0, size = '', image = '' } = p;
      let { id } = p;
      if (!name) {
        invalidCount++;
        continue;
      }

      if (!id) {
        id = await generateNextId();
      }

      const productExists = await Product.findOne({ id });
      if (productExists) {
        // Update existing
        productExists.name = name;
        productExists.category = category;
        productExists.description = description;
        productExists.price = price;
        productExists.size = size;
        if (image) productExists.image = image; // only update image if provided
        await productExists.save();
        updatedCount++;
      } else {
        // Create new
        const product = new Product({ id, name, category, description, price, size, image });
        await product.save();
        addedCount++;
      }
    }

    res.status(200).json({ message: `${addedCount} products added, ${updatedCount} updated. (Skipped ${invalidCount} missing 'name')` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id, name, category, description, price, size, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.id = id || product.id;
      product.name = name || product.name;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.size = size !== undefined ? size : product.size;
      product.image = image !== undefined ? image : product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
