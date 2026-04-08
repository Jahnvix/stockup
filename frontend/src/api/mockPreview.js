const previewUser = {
  id: "preview-admin",
  name: "Admin User",
  email: "admin@softstock.com",
  role: "admin",
};

const categories = [
  { _id: "cat-clothes", name: "Clothes", accentColor: "#e8d6d0" },
  { _id: "cat-skincare", name: "Skincare", accentColor: "#d7e5dc" },
  { _id: "cat-bags", name: "Bags", accentColor: "#d9dcee" },
];

const products = [
  {
    _id: "prd-1",
    name: "Luna Linen Co-ord Set",
    sku: "CL-101",
    description: "Relaxed two-piece linen set designed for everyday premium edits.",
    category: categories[0],
    supplier: "Mellow Thread Co.",
    location: "Rack C1",
    quantity: 18,
    reorderLevel: 8,
    unitCost: 1450,
    unitPrice: 2490,
    status: "Active",
  },
  {
    _id: "prd-2",
    name: "Satin Evening Dress",
    sku: "CL-204",
    description: "Soft drape occasion dress in the best-selling evening palette.",
    category: categories[0],
    supplier: "Studio Aurelia",
    location: "Rack C4",
    quantity: 6,
    reorderLevel: 7,
    unitCost: 2200,
    unitPrice: 3890,
    status: "Low Stock",
  },
  {
    _id: "prd-3",
    name: "Cotton Everyday Shirt",
    sku: "CL-118",
    description: "Breathable staple shirt stocked in neutral seasonal sizes.",
    category: categories[0],
    supplier: "Northline Apparel",
    location: "Rack C2",
    quantity: 24,
    reorderLevel: 10,
    unitCost: 720,
    unitPrice: 1290,
    status: "Active",
  },
  {
    _id: "prd-4",
    name: "Vitamin C Glow Serum",
    sku: "SK-310",
    description: "Fast-moving brightening serum for the front display shelf.",
    category: categories[1],
    supplier: "Lumiere Labs",
    location: "Shelf S1",
    quantity: 14,
    reorderLevel: 6,
    unitCost: 430,
    unitPrice: 899,
    status: "Active",
  },
  {
    _id: "prd-5",
    name: "Barrier Repair Cream",
    sku: "SK-322",
    description: "Skin barrier cream with high repeat purchase from walk-in buyers.",
    category: categories[1],
    supplier: "Lumiere Labs",
    location: "Shelf S2",
    quantity: 4,
    reorderLevel: 5,
    unitCost: 390,
    unitPrice: 799,
    status: "Low Stock",
  },
  {
    _id: "prd-6",
    name: "Hydra Mist Toner",
    sku: "SK-298",
    description: "Cooling toner currently awaiting replenishment from the vendor.",
    category: categories[1],
    supplier: "Pure Dew Collective",
    location: "Shelf S3",
    quantity: 0,
    reorderLevel: 5,
    unitCost: 250,
    unitPrice: 540,
    status: "Out of Stock",
  },
  {
    _id: "prd-7",
    name: "Crescent Tote Bag",
    sku: "BG-410",
    description: "Structured tote with everyday carry capacity and premium finish.",
    category: categories[2],
    supplier: "Atelier Carry",
    location: "Display B1",
    quantity: 12,
    reorderLevel: 6,
    unitCost: 980,
    unitPrice: 1890,
    status: "Active",
  },
  {
    _id: "prd-8",
    name: "Mini Crossbody Bag",
    sku: "BG-422",
    description: "Compact crossbody bag selling strongly in the gifting segment.",
    category: categories[2],
    supplier: "Atelier Carry",
    location: "Display B2",
    quantity: 5,
    reorderLevel: 5,
    unitCost: 820,
    unitPrice: 1690,
    status: "Low Stock",
  },
];

const movements = [
  {
    _id: "mov-1",
    product: { _id: "prd-1", name: "Luna Linen Co-ord Set", sku: "CL-101" },
    type: "stock_in",
    quantity: 18,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T10:20:00.000Z",
    reference: "SOFT-001",
  },
  {
    _id: "mov-2",
    product: { _id: "prd-7", name: "Crescent Tote Bag", sku: "BG-410" },
    type: "stock_in",
    quantity: 12,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T10:40:00.000Z",
    reference: "SOFT-002",
  },
  {
    _id: "mov-3",
    product: { _id: "prd-4", name: "Vitamin C Glow Serum", sku: "SK-310" },
    type: "stock_in",
    quantity: 14,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T10:05:00.000Z",
    reference: "SOFT-003",
  },
  {
    _id: "mov-4",
    product: { _id: "prd-2", name: "Satin Evening Dress", sku: "CL-204" },
    type: "stock_out",
    quantity: 4,
    performedBy: { name: "Warehouse Staff", role: "staff" },
    createdAt: "2026-04-08T11:15:00.000Z",
    reference: "SOFT-004",
  },
  {
    _id: "mov-5",
    product: { _id: "prd-5", name: "Barrier Repair Cream", sku: "SK-322" },
    type: "stock_out",
    quantity: 3,
    performedBy: { name: "Warehouse Staff", role: "staff" },
    createdAt: "2026-04-08T11:05:00.000Z",
    reference: "SOFT-005",
  },
  {
    _id: "mov-6",
    product: { _id: "prd-6", name: "Hydra Mist Toner", sku: "SK-298" },
    type: "stock_out",
    quantity: 6,
    performedBy: { name: "Warehouse Staff", role: "staff" },
    createdAt: "2026-04-08T11:22:00.000Z",
    reference: "SOFT-006",
  },
  {
    _id: "mov-7",
    product: { _id: "prd-8", name: "Mini Crossbody Bag", sku: "BG-422" },
    type: "adjustment",
    quantity: 5,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T11:10:00.000Z",
    reference: "SOFT-007",
  },
];

const inventoryValue = products.reduce(
  (sum, product) => sum + product.quantity * product.unitCost,
  0
);

export const isPreviewMock = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("previewMock") === "1";

export const previewSession = {
  token: "preview-token",
  user: previewUser,
};

const getDashboardSummary = () => {
  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel
  );
  const outOfStockProducts = products.filter((product) => product.quantity <= 0);

  return {
    overview: {
      totalProducts: products.length,
      inventoryValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      activeCategories: categories.length,
    },
    movementTotals: {
      stockIn: 44,
      stockOut: 13,
      adjustments: 5,
    },
    lowStockProducts,
    outOfStockProducts,
    categoryBreakdown: categories.map((category) => {
      const categoryProducts = products.filter(
        (product) => product.category._id === category._id
      );

      return {
        id: category._id,
        name: category.name,
        accentColor: category.accentColor,
        itemCount: categoryProducts.length,
        quantity: categoryProducts.reduce((sum, product) => sum + product.quantity, 0),
      };
    }),
    recentMovements: movements,
  };
};

const getFilteredProducts = (path) => {
  const url = new URL(`http://preview.local${path}`);
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const status = url.searchParams.get("status") || "";
  const category = url.searchParams.get("category") || "";

  return products.filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.sku, product.supplier, product.location]
        .join(" ")
        .toLowerCase()
        .includes(search);
    const matchesStatus = !status || product.status === status;
    const matchesCategory = !category || product.category._id === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });
};

export const getMockResponse = (path, { method = "GET" } = {}) => {
  if (path === "/auth/me") {
    return { user: previewSession.user };
  }

  if (path === "/dashboard/summary") {
    return getDashboardSummary();
  }

  if (path === "/inventory/categories") {
    return { categories };
  }

  if (path.startsWith("/inventory/products") && method === "GET") {
    return { products: getFilteredProducts(path) };
  }

  if (path === "/inventory/movements") {
    return { movements };
  }

  if (path === "/auth/login" || path === "/auth/register") {
    return previewSession;
  }

  return { message: "Preview mode action simulated successfully." };
};
