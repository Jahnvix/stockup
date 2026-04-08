import { randomUUID } from "crypto";
import express from "express";
import {
  defaultCategories,
  sampleMovements,
  sampleProducts,
} from "../data/defaultData.js";
import { deriveStockStatus, slugify } from "../utils/inventory.js";

const router = express.Router();

const categories = defaultCategories.map((category) => ({
  _id: `cat-${slugify(category.name)}`,
  name: category.name,
  slug: slugify(category.name),
  accentColor: category.accentColor,
}));

const users = [
  {
    id: "usr-admin",
    name: "Admin User",
    email: "admin@softstock.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: "usr-staff",
    name: "Warehouse Staff",
    email: "staff@softstock.com",
    password: "Staff@123",
    role: "staff",
  },
];

const categoryIdByName = categories.reduce((accumulator, category) => {
  accumulator[category.name] = category._id;
  return accumulator;
}, {});

const products = sampleProducts.map((product, index) => ({
  _id: `prd-${index + 1}`,
  name: product.name,
  sku: product.sku,
  description: product.description,
  category: categoryIdByName[product.categoryName],
  supplier: product.supplier,
  location: product.location,
  quantity: product.quantity,
  reorderLevel: product.reorderLevel,
  unitCost: product.unitCost,
  unitPrice: product.unitPrice,
  status: deriveStockStatus(product.quantity, product.reorderLevel),
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
}));

const productIdBySku = products.reduce((accumulator, product) => {
  accumulator[product.sku] = product._id;
  return accumulator;
}, {});

const productCostBySku = products.reduce((accumulator, product) => {
  accumulator[product.sku] = product.unitCost;
  return accumulator;
}, {});

const movements = sampleMovements.map((movement, index) => ({
  _id: `mov-${index + 1}`,
  product: productIdBySku[movement.sku],
  type: movement.type,
  quantity: movement.quantity,
  note: movement.note,
  reference: movement.reference,
  previousQuantity: movement.previousQuantity,
  newQuantity: movement.newQuantity,
  performedBy: movement.performedByRole === "staff" ? "usr-staff" : "usr-admin",
  unitCost: productCostBySku[movement.sku],
  createdAt: movement.createdAt,
}));

const sessions = new Map();

const clone = (value) => JSON.parse(JSON.stringify(value));

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const getCategoryById = (id) => categories.find((category) => category._id === id);
const getUserById = (id) => users.find((user) => user.id === id);
const getProductById = (id) => products.find((product) => product._id === id);

const serializeProduct = (product) => ({
  ...clone(product),
  category: clone(getCategoryById(product.category)),
});

const serializeMovement = (movement) => {
  const product = getProductById(movement.product);
  const performedBy = getUserById(movement.performedBy);

  return {
    ...clone(movement),
    product: product ? { _id: product._id, name: product.name, sku: product.sku } : null,
    performedBy: performedBy ? sanitizeUser(performedBy) : null,
  };
};

const issueToken = (user) => {
  const token = `demo-token-${user.id}`;
  sessions.set(token, user.id);
  return token;
};

const readToken = (req) => req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();

const protectDemo = (req, res, next) => {
  const token = readToken(req);
  const userId = token ? sessions.get(token) || token.replace(/^demo-token-/, "") : null;
  const user = userId ? getUserById(userId) : null;

  if (!user) {
    res.status(401).json({ message: "Not authorized. Missing or invalid demo token." });
    return;
  }

  req.user = user;
  next();
};

const computeDashboard = () => {
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.unitCost,
    0
  );
  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel
  );
  const outOfStockProducts = products.filter((product) => product.quantity <= 0);
  const movementTotals = movements.reduce(
    (totals, movement) => {
      if (movement.type === "stock_in") {
        totals.stockIn += movement.quantity;
      } else if (movement.type === "stock_out") {
        totals.stockOut += movement.quantity;
      } else {
        totals.adjustments += movement.quantity;
      }
      return totals;
    },
    { stockIn: 0, stockOut: 0, adjustments: 0 }
  );

  return {
    overview: {
      totalProducts: products.length,
      inventoryValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      activeCategories: categories.length,
    },
    movementTotals,
    lowStockProducts: lowStockProducts.map(serializeProduct),
    outOfStockProducts: outOfStockProducts.map(serializeProduct),
    categoryBreakdown: categories.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category._id);
      return {
        id: category._id,
        name: category.name,
        accentColor: category.accentColor,
        itemCount: categoryProducts.length,
        quantity: categoryProducts.reduce((sum, product) => sum + product.quantity, 0),
      };
    }),
    recentMovements: movements
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(serializeMovement),
  };
};

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (entry) => entry.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  res.json({
    message: "Login successful.",
    token: issueToken(user),
    user: sanitizeUser(user),
  });
});

router.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required." });
    return;
  }

  const existing = users.find(
    (entry) => entry.email.toLowerCase() === String(email).toLowerCase()
  );

  if (existing) {
    res.status(400).json({ message: "An account with that email already exists." });
    return;
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    password,
    role: "staff",
  };
  users.push(user);

  res.status(201).json({
    message: "Account created successfully.",
    token: issueToken(user),
    user: sanitizeUser(user),
  });
});

router.get("/auth/me", protectDemo, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

router.get("/dashboard/summary", protectDemo, (_req, res) => {
  res.json(computeDashboard());
});

router.get("/inventory/categories", protectDemo, (_req, res) => {
  res.json({ categories: clone(categories) });
});

router.get("/inventory/products", protectDemo, (req, res) => {
  const { search = "", status = "", category = "" } = req.query;
  const normalizedSearch = String(search).toLowerCase();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.sku, product.supplier, product.location]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesStatus = !status || product.status === status;
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(serializeProduct);

  res.json({ products: filteredProducts });
});

router.post("/inventory/products", protectDemo, (req, res) => {
  const {
    name,
    sku,
    description = "",
    category,
    supplier,
    location,
    quantity = 0,
    reorderLevel = 0,
    unitCost = 0,
    unitPrice = 0,
  } = req.body;

  if (!name || !sku || !category || !supplier || !location) {
    res.status(400).json({ message: "Please provide all required product details." });
    return;
  }

  if (products.some((product) => product.sku === sku)) {
    res.status(400).json({ message: "SKU must be unique." });
    return;
  }

  const now = new Date().toISOString();
  const product = {
    _id: randomUUID(),
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
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(product);

  res.status(201).json({
    message: "Product created successfully.",
    product: serializeProduct(product),
  });
});

router.put("/inventory/products/:id", protectDemo, (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
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
  product.updatedAt = new Date().toISOString();

  res.json({
    message: "Product updated successfully.",
    product: serializeProduct(product),
  });
});

router.post("/inventory/products/:id/movement", protectDemo, (req, res) => {
  const { type, quantity, note = "", reference = "" } = req.body;
  const product = getProductById(req.params.id);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  const movementQuantity = Number(quantity);
  if (!type || Number.isNaN(movementQuantity) || movementQuantity === 0) {
    res
      .status(400)
      .json({ message: "Movement type and a non-zero quantity are required." });
    return;
  }

  const previousQuantity = product.quantity;
  let newQuantity = previousQuantity;

  if (type === "stock_in") {
    if (movementQuantity < 0) {
      res.status(400).json({ message: "Stock-in quantity must be positive." });
      return;
    }
    newQuantity += movementQuantity;
  } else if (type === "stock_out") {
    if (movementQuantity < 0) {
      res.status(400).json({ message: "Stock-out quantity must be positive." });
      return;
    }
    if (movementQuantity > previousQuantity) {
      res.status(400).json({ message: "Not enough stock available for that movement." });
      return;
    }
    newQuantity -= movementQuantity;
  } else if (type === "adjustment") {
    newQuantity += movementQuantity;
    if (newQuantity < 0) {
      res.status(400).json({ message: "Adjustment cannot reduce stock below zero." });
      return;
    }
  } else {
    res.status(400).json({ message: "Unsupported movement type." });
    return;
  }

  product.quantity = newQuantity;
  product.status = deriveStockStatus(newQuantity, product.reorderLevel);
  product.updatedAt = new Date().toISOString();

  const movement = {
    _id: randomUUID(),
    product: product._id,
    type,
    quantity: movementQuantity,
    note,
    reference,
    previousQuantity,
    newQuantity,
    performedBy: req.user.id,
    unitCost: product.unitCost,
    createdAt: new Date().toISOString(),
  };

  movements.unshift(movement);

  res.status(201).json({
    message: "Stock movement recorded successfully.",
    movement: serializeMovement(movement),
  });
});

router.get("/inventory/movements", protectDemo, (_req, res) => {
  res.json({
    movements: movements
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12)
      .map(serializeMovement),
  });
});

export default router;
