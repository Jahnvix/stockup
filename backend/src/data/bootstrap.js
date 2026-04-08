import { defaultCategories, sampleProducts } from "./defaultData.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import User from "../models/User.js";
import { deriveStockStatus, slugify } from "../utils/inventory.js";

const ensureUsers = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  await User.create([
    {
      name: "Admin User",
      email: "admin@softstock.com",
      password: "Admin@123",
      role: "admin",
    },
    {
      name: "Warehouse Staff",
      email: "staff@softstock.com",
      password: "Staff@123",
      role: "staff",
    },
  ]);
};

const ensureCategories = async () => {
  const categories = await Category.find();
  if (categories.length > 0) {
    return categories;
  }

  return Category.insertMany(
    defaultCategories.map((category) => ({
      ...category,
      slug: slugify(category.name),
    }))
  );
};

export const bootstrapDemoData = async () => {
  await ensureUsers();
  const categories = await ensureCategories();

  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    return;
  }

  const admin = await User.findOne({ role: "admin" });
  const staff = await User.findOne({ role: "staff" });
  const categoryLookup = categories.reduce((accumulator, category) => {
    accumulator[category.name] = category;
    return accumulator;
  }, {});

  const products = await Product.insertMany(
    sampleProducts.map((product) => ({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: categoryLookup[product.categoryName]._id,
      supplier: product.supplier,
      location: product.location,
      quantity: product.quantity,
      reorderLevel: product.reorderLevel,
      unitCost: product.unitCost,
      unitPrice: product.unitPrice,
      status: deriveStockStatus(product.quantity, product.reorderLevel),
      lastUpdatedBy: admin?._id,
    }))
  );

  await StockMovement.insertMany([
    {
      product: products[0]._id,
      type: "stock_in",
      quantity: 22,
      note: "Opening stock",
      reference: "BOOT-001",
      previousQuantity: 0,
      newQuantity: 22,
      performedBy: admin._id,
      unitCost: products[0].unitCost,
    },
    {
      product: products[1]._id,
      type: "stock_in",
      quantity: 8,
      note: "Opening stock",
      reference: "BOOT-002",
      previousQuantity: 0,
      newQuantity: 8,
      performedBy: admin._id,
      unitCost: products[1].unitCost,
    },
    {
      product: products[2]._id,
      type: "stock_in",
      quantity: 46,
      note: "Opening stock",
      reference: "BOOT-003",
      previousQuantity: 0,
      newQuantity: 46,
      performedBy: admin._id,
      unitCost: products[2].unitCost,
    },
    {
      product: products[4]._id,
      type: "stock_out",
      quantity: 5,
      note: "Initial issue to store floor",
      reference: "BOOT-004",
      previousQuantity: 5,
      newQuantity: 0,
      performedBy: staff._id,
      unitCost: products[4].unitCost,
    },
  ]);
};
