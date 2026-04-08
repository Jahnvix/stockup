import { defaultCategories } from "../data/defaultData.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deriveStockStatus, slugify } from "../utils/inventory.js";

const ensureCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) {
    return;
  }

  await Category.insertMany(
    defaultCategories.map((category) => ({
      ...category,
      slug: slugify(category.name),
    }))
  );
};

const populateProduct = {
  path: "category",
  select: "name accentColor",
};

export const getCategories = asyncHandler(async (_req, res) => {
  await ensureCategories();
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { search = "", status = "", category = "" } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { name: regex },
      { sku: regex },
      { supplier: regex },
      { location: regex },
    ];
  }

  const products = await Product.find(query)
    .sort({ updatedAt: -1 })
    .populate(populateProduct);

  res.json({ products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    description,
    category,
    supplier,
    location,
    quantity = 0,
    reorderLevel = 0,
    unitCost = 0,
    unitPrice = 0,
  } = req.body;

  if (!name || !sku || !category || !supplier || !location) {
    res.status(400);
    throw new Error("Please provide all required product details.");
  }

  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    res.status(400);
    throw new Error("SKU must be unique.");
  }

  const product = await Product.create({
    name,
    sku,
    description,
    category,
    supplier,
    location,
    quantity: Number(quantity),
    reorderLevel: Number(reorderLevel),
    unitCost: Number(unitCost),
    unitPrice: Number(unitPrice),
    status: deriveStockStatus(Number(quantity), Number(reorderLevel)),
    lastUpdatedBy: req.user._id,
  });

  const populatedProduct = await Product.findById(product._id).populate(populateProduct);
  res.status(201).json({
    message: "Product created successfully.",
    product: populatedProduct,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const fields = [
    "name",
    "sku",
    "description",
    "category",
    "supplier",
    "location",
    "quantity",
    "reorderLevel",
    "unitCost",
    "unitPrice",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  product.quantity = Number(product.quantity);
  product.reorderLevel = Number(product.reorderLevel);
  product.unitCost = Number(product.unitCost);
  product.unitPrice = Number(product.unitPrice);
  product.status = deriveStockStatus(product.quantity, product.reorderLevel);
  product.lastUpdatedBy = req.user._id;

  await product.save();

  const populatedProduct = await Product.findById(product._id).populate(populateProduct);
  res.json({
    message: "Product updated successfully.",
    product: populatedProduct,
  });
});

export const getMovements = asyncHandler(async (_req, res) => {
  const movements = await StockMovement.find()
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("product", "name sku")
    .populate("performedBy", "name role");

  res.json({ movements });
});

export const createMovement = asyncHandler(async (req, res) => {
  const { type, quantity, note = "", reference = "" } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  if (!type || quantity === undefined) {
    res.status(400);
    throw new Error("Movement type and quantity are required.");
  }

  const movementQuantity = Number(quantity);
  if (Number.isNaN(movementQuantity) || movementQuantity === 0) {
    res.status(400);
    throw new Error("Quantity must be a non-zero number.");
  }

  const previousQuantity = product.quantity;
  let newQuantity = previousQuantity;

  if (type === "stock_in") {
    if (movementQuantity < 0) {
      res.status(400);
      throw new Error("Stock-in quantity must be positive.");
    }
    newQuantity += movementQuantity;
  } else if (type === "stock_out") {
    if (movementQuantity < 0) {
      res.status(400);
      throw new Error("Stock-out quantity must be positive.");
    }
    if (movementQuantity > previousQuantity) {
      res.status(400);
      throw new Error("Not enough stock available for that movement.");
    }
    newQuantity -= movementQuantity;
  } else if (type === "adjustment") {
    newQuantity += movementQuantity;
    if (newQuantity < 0) {
      res.status(400);
      throw new Error("Adjustment cannot reduce stock below zero.");
    }
  } else {
    res.status(400);
    throw new Error("Unsupported movement type.");
  }

  product.quantity = newQuantity;
  product.status = deriveStockStatus(newQuantity, product.reorderLevel);
  product.lastMovementAt = new Date();
  product.lastUpdatedBy = req.user._id;
  await product.save();

  const movement = await StockMovement.create({
    product: product._id,
    type,
    quantity: movementQuantity,
    note,
    reference,
    previousQuantity,
    newQuantity,
    performedBy: req.user._id,
    unitCost: product.unitCost,
  });

  const populatedMovement = await StockMovement.findById(movement._id)
    .populate("product", "name sku")
    .populate("performedBy", "name role");

  res.status(201).json({
    message: "Stock movement recorded successfully.",
    movement: populatedMovement,
  });
});

