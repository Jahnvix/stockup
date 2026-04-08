const previewUser = {
  id: "preview-admin",
  name: "Admin User",
  email: "admin@softstock.com",
  role: "admin",
};

const categories = [
  { _id: "cat-office", name: "Office Essentials", accentColor: "#d6e6d8" },
  { _id: "cat-electronics", name: "Electronics", accentColor: "#d9e7f2" },
  { _id: "cat-home", name: "Home Decor", accentColor: "#f4ddcf" },
  { _id: "cat-packaging", name: "Packaging", accentColor: "#ece3d1" },
  { _id: "cat-care", name: "Care Supplies", accentColor: "#f2dfd9" },
];

const products = [
  {
    _id: "prd-1",
    name: "Linen Storage Basket",
    sku: "HD-102",
    description: "Soft-tone woven basket for accessory organization.",
    category: categories[2],
    supplier: "Bloom & Beam",
    location: "Aisle A1",
    quantity: 22,
    reorderLevel: 10,
    unitCost: 680,
    unitPrice: 1150,
    status: "Active",
  },
  {
    _id: "prd-2",
    name: "Portable Label Printer",
    sku: "EL-205",
    description: "Compact wireless label printer for shelf tagging.",
    category: categories[1],
    supplier: "North Circuit",
    location: "Aisle C3",
    quantity: 8,
    reorderLevel: 6,
    unitCost: 3100,
    unitPrice: 4290,
    status: "Active",
  },
  {
    _id: "prd-3",
    name: "Eco Wrap Roll",
    sku: "PK-310",
    description: "Biodegradable wrap used for outbound packaging.",
    category: categories[3],
    supplier: "PackSoft",
    location: "Store Room 2",
    quantity: 46,
    reorderLevel: 18,
    unitCost: 95,
    unitPrice: 180,
    status: "Active",
  },
  {
    _id: "prd-4",
    name: "Desk Planner Pad",
    sku: "OE-128",
    description: "Neutral-tone daily planner pads for operations desk.",
    category: categories[0],
    supplier: "Paper Nest",
    location: "Aisle B1",
    quantity: 14,
    reorderLevel: 12,
    unitCost: 130,
    unitPrice: 249,
    status: "Active",
  },
  {
    _id: "prd-5",
    name: "Surface Care Spray",
    sku: "CS-412",
    description: "Inventory-safe cleaning spray for display zones.",
    category: categories[4],
    supplier: "Clear Habit",
    location: "Store Room 1",
    quantity: 0,
    reorderLevel: 8,
    unitCost: 160,
    unitPrice: 275,
    status: "Out of Stock",
  },
];

const movements = [
  {
    _id: "mov-1",
    product: { _id: "prd-3", name: "Eco Wrap Roll", sku: "PK-310" },
    type: "stock_in",
    quantity: 46,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T09:15:00.000Z",
    reference: "BOOT-003",
  },
  {
    _id: "mov-2",
    product: { _id: "prd-2", name: "Portable Label Printer", sku: "EL-205" },
    type: "stock_in",
    quantity: 8,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T08:52:00.000Z",
    reference: "BOOT-002",
  },
  {
    _id: "mov-3",
    product: { _id: "prd-1", name: "Linen Storage Basket", sku: "HD-102" },
    type: "stock_in",
    quantity: 22,
    performedBy: { name: "Admin User", role: "admin" },
    createdAt: "2026-04-08T08:40:00.000Z",
    reference: "BOOT-001",
  },
  {
    _id: "mov-4",
    product: { _id: "prd-5", name: "Surface Care Spray", sku: "CS-412" },
    type: "stock_out",
    quantity: 5,
    performedBy: { name: "Warehouse Staff", role: "staff" },
    createdAt: "2026-04-08T07:20:00.000Z",
    reference: "BOOT-004",
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
      stockIn: 76,
      stockOut: 5,
      adjustments: 2,
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
