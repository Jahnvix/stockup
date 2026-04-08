import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { defaultCategories, sampleProducts } from "./defaultData.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import User from "../models/User.js";
import { deriveStockStatus, slugify } from "../utils/inventory.js";

dotenv.config();

const seedDatabase = async () => {
  await connectDB();

  await Promise.all([
    StockMovement.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    User.deleteMany(),
  ]);

  const [admin, staff] = await User.create([
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

  const categories = await Category.insertMany(
    defaultCategories.map((category) => ({
      ...category,
      slug: slugify(category.name),
    }))
  );

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
      lastUpdatedBy: admin._id,
    }))
  );

  await StockMovement.insertMany([
    {
      product: products[0]._id,
      type: "stock_in",
      quantity: 22,
      note: "Opening inventory",
      reference: "SEED-001",
      previousQuantity: 0,
      newQuantity: 22,
      performedBy: admin._id,
      unitCost: products[0].unitCost,
    },
    {
      product: products[1]._id,
      type: "stock_in",
      quantity: 8,
      note: "Opening inventory",
      reference: "SEED-002",
      previousQuantity: 0,
      newQuantity: 8,
      performedBy: admin._id,
      unitCost: products[1].unitCost,
    },
    {
      product: products[4]._id,
      type: "stock_out",
      quantity: 3,
      note: "Store launch consumption",
      reference: "SEED-003",
      previousQuantity: 3,
      newQuantity: 0,
      performedBy: staff._id,
      unitCost: products[4].unitCost,
    },
  ]);

  console.log("Seed data created successfully.");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});

