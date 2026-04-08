import { defaultCategories, sampleMovements, sampleProducts } from "./defaultData.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import User from "../models/User.js";
import { deriveStockStatus, slugify } from "../utils/inventory.js";

const seedUsers = [
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
];

const ensureUsers = async () => {
  await Promise.all(
    seedUsers.map(async (seedUser) => {
      const existing = await User.findOne({ email: seedUser.email });
      if (!existing) {
        await User.create(seedUser);
      }
    })
  );
};

const ensureCategories = async () => {
  const ensuredCategories = [];

  for (const category of defaultCategories) {
    const slug = slugify(category.name);
    const ensured = await Category.findOneAndUpdate(
      { slug },
      {
        $set: {
          accentColor: category.accentColor,
        },
        $setOnInsert: {
          name: category.name,
          slug,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    ensuredCategories.push(ensured);
  }

  return ensuredCategories;
};

export const bootstrapDemoData = async () => {
  await ensureUsers();
  const categories = await ensureCategories();

  const admin = await User.findOne({ role: "admin" });
  const staff = await User.findOne({ role: "staff" });
  const categoryLookup = categories.reduce((accumulator, category) => {
    accumulator[category.name] = category;
    return accumulator;
  }, {});

  const sampleSkus = sampleProducts.map((product) => product.sku);
  const existingProducts = await Product.find({ sku: { $in: sampleSkus } });
  const existingSkuSet = new Set(existingProducts.map((product) => product.sku));

  const productsToInsert = sampleProducts
    .filter((product) => !existingSkuSet.has(product.sku))
    .map((product) => ({
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
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

  const insertedProducts = productsToInsert.length
    ? await Product.insertMany(productsToInsert)
    : [];
  const productLookup = [...existingProducts, ...insertedProducts].reduce(
    (accumulator, product) => {
      accumulator[product.sku] = product;
      return accumulator;
    },
    {}
  );

  const existingRefs = new Set(
    (
      await StockMovement.find({
        reference: { $in: sampleMovements.map((movement) => movement.reference) },
      })
    ).map((movement) => movement.reference)
  );

  const movementsToInsert = sampleMovements
    .filter((movement) => !existingRefs.has(movement.reference))
    .map((movement) => {
      const product = productLookup[movement.sku];
      const performedBy = movement.performedByRole === "staff" ? staff : admin;

      if (!product || !performedBy) {
        return null;
      }

      return {
        product: product._id,
        type: movement.type,
        quantity: movement.quantity,
        note: movement.note,
        reference: movement.reference,
        previousQuantity: movement.previousQuantity,
        newQuantity: movement.newQuantity,
        performedBy: performedBy._id,
        unitCost: product.unitCost,
        createdAt: movement.createdAt,
        updatedAt: movement.createdAt,
      };
    })
    .filter(Boolean);

  if (movementsToInsert.length) {
    await StockMovement.insertMany(movementsToInsert);
  }
};
