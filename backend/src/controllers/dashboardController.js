import Category from "../models/Category.js";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [products, categories, recentMovements, monthMovements, totalProducts] =
    await Promise.all([
      Product.find().populate("category", "name accentColor").sort({ updatedAt: -1 }),
      Category.find().sort({ name: 1 }),
      StockMovement.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("product", "name sku")
        .populate("performedBy", "name role"),
      StockMovement.find({ createdAt: { $gte: monthStart } }),
      Product.countDocuments(),
    ]);

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.unitCost,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel
  );
  const outOfStockProducts = products.filter((product) => product.quantity <= 0);

  const categoryBreakdown = categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => String(product.category?._id) === String(category._id)
    );

    const quantity = categoryProducts.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    return {
      id: category._id,
      name: category.name,
      accentColor: category.accentColor,
      itemCount: categoryProducts.length,
      quantity,
    };
  });

  const movementTotals = monthMovements.reduce(
    (totals, movement) => {
      if (movement.type === "stock_in") {
        totals.stockIn += movement.quantity;
      }
      if (movement.type === "stock_out") {
        totals.stockOut += movement.quantity;
      }
      if (movement.type === "adjustment") {
        totals.adjustments += movement.quantity;
      }
      return totals;
    },
    { stockIn: 0, stockOut: 0, adjustments: 0 }
  );

  res.json({
    overview: {
      totalProducts,
      inventoryValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      activeCategories: categories.length,
    },
    movementTotals,
    lowStockProducts: lowStockProducts.slice(0, 5),
    outOfStockProducts: outOfStockProducts.slice(0, 5),
    categoryBreakdown,
    recentMovements,
  });
});

