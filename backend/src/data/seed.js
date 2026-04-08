import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { defaultCategories, sampleMovements, sampleProducts } from "./defaultData.js";
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
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
  );

  const productLookup = products.reduce((accumulator, product) => {
    accumulator[product.sku] = product;
    return accumulator;
  }, {});

  await StockMovement.insertMany(
    sampleMovements.map((movement) => ({
      product: productLookup[movement.sku]._id,
      type: movement.type,
      quantity: movement.quantity,
      note: movement.note,
      reference: movement.reference,
      previousQuantity: movement.previousQuantity,
      newQuantity: movement.newQuantity,
      performedBy: movement.performedByRole === "staff" ? staff._id : admin._id,
      unitCost: productLookup[movement.sku].unitCost,
      createdAt: movement.createdAt,
      updatedAt: movement.createdAt,
    }))
  );

  console.log("Seed data created successfully.");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
