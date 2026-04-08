import { randomUUID } from "crypto";
import express from "express";
import { deriveStockStatus } from "../utils/inventory.js";

const router = express.Router();

const categories = [
  { _id: "cat-office", name: "Office Essentials", slug: "office-essentials", accentColor: "#d6e6d8" },
  { _id: "cat-electronics", name: "Electronics", slug: "electronics", accentColor: "#d9e7f2" },
  { _id: "cat-home", name: "Home Decor", slug: "home-decor", accentColor: "#f4ddcf" },
  { _id: "cat-packaging", name: "Packaging", slug: "packaging", accentColor: "#ece3d1" },
  { _id: "cat-care", name: "Care Supplies", slug: "care-supplies", accentColor: "#f2dfd9" },
];

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

const products = [
  {
    _id: "prd-1",
    name: "Linen Storage Basket",
    sku: "HD-102",
    description: "Soft-tone woven basket for accessory organization.",
    category: "cat-home",
    supplier: "Bloom & Beam",
    location: "Aisle A1",
    quantity: 22,
    reorderLevel: 10,
    unitCost: 680,
    unitPrice: 1150,
    status: "Active",
    createdAt: "2026-04-08T08:00:00.000Z",
    updatedAt: "2026-04-08T10:10:00.000Z",
  },
  {
    _id: "prd-2",
    name: "Portable Label Printer",
    sku: "EL-205",
    description: "Compact wireless label printer for shelf tagging.",
    category: "cat-electronics",
    supplier: "North Circuit",
    location: "Aisle C3",
    quantity: 8,
    reorderLevel: 6,
    unitCost: 3100,
    unitPrice: 4290,
    status: "Active",
    createdAt: "2026-04-08T08:15:00.000Z",
    updatedAt: "2026-04-08T10:25:00.000Z",
  },
  {
    _id: "prd-3",
    name: "Eco Wrap Roll",
    sku: "PK-310",
    description: "Biodegradable wrap used for outbound packaging.",
    category: "cat-packaging",
    supplier: "PackSoft",
    location: "Store Room 2",
    quantity: 46,
    reorderLevel: 18,
    unitCost: 95,
    unitPrice: 180,
    status: "Active",
    createdAt: "2026-04-08T08:25:00.000Z",
    updatedAt: "2026-04-08T10:45:00.000Z",
  },
  {
    _id: "prd-4",
    name: "Desk Planner Pad",
    sku: "OE-128",
    description: "Neutral-tone daily planner pads for operations desk.",
    category: "cat-office",
    supplier: "Paper Nest",
    location: "Aisle B1",
    quantity: 14,
    reorderLevel: 12,
    unitCost: 130,
    unitPrice: 249,
    status: "Active",
    createdAt: "2026-04-08T08:35:00.000Z",
    updatedAt: "2026-04-08T10:50:00.000Z",
  },
  {
    _id: "prd-5",
    name: "Surface Care Spray",
    sku: "CS-412",
    description: "Inventory-safe cleaning spray for display zones.",
    category: "cat-care",
    supplier: "Clear Habit",
    location: "Store Room 1",
    quantity: 0,
    reorderLevel: 8,
    unitCost: 160,
    unitPrice: 275,
    status: "Out of Stock",
    createdAt: "2026-04-08T08:45:00.000Z",
    updatedAt: "2026-04-08T10:55:00.000Z",
  },
];

const movements = [
  {
    _id: "mov-1",
    product: "prd-3",
    type: "stock_in",
    quantity: 46,
    note: "Opening stock",
    reference: "BOOT-003",
    previousQuantity: 0,
    newQuantity: 46,
    performedBy: "usr-admin",
    unitCost: 95,
    createdAt: "2026-04-08T10:45:00.000Z",
  },
  {
    _id: "mov-2",
    product: "prd-2",
    type: "stock_in",
    quantity: 8,
    note: "Opening stock",
    reference: "BOOT-002",
    previousQuantity: 0,
    newQuantity: 8,
    performedBy: "usr-admin",
    unitCost: 3100,
    createdAt: "2026-04-08T10:25:00.000Z",
  },
  {
    _id: "mov-3",
    product: "prd-1",
    type: "stock_in",
    quantity: 22,
    note: "Opening stock",
    reference: "BOOT-001",
    previousQuantity: 0,
    newQuantity: 22,
    performedBy: "usr-admin",
    unitCost: 680,
    createdAt: "2026-04-08T10:10:00.000Z",
  },
  {
    _id: "mov-4",
    product: "prd-5",
    type: "stock_out",
    quantity: 5,
    note: "Initial issue to store floor",
    reference: "BOOT-004",
    previousQuantity: 5,
    newQuantity: 0,
    performedBy: "usr-staff",
    unitCost: 160,
    createdAt: "2026-04-08T10:58:00.000Z",
  },
];

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
