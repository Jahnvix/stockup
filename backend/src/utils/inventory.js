export const deriveStockStatus = (quantity, reorderLevel) => {
  if (quantity <= 0) {
    return "Out of Stock";
  }
  if (quantity <= reorderLevel) {
    return "Low Stock";
  }
  return "Active";
};

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
