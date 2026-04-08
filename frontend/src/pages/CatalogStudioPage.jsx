import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { apiRequest, currencyFormatter, formatDate } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialProductForm = {
  name: "",
  sku: "",
  description: "",
  category: "",
  supplier: "",
  location: "",
  quantity: 0,
  reorderLevel: 0,
  unitCost: 0,
  unitPrice: 0,
};

const initialMovementForm = {
  productId: "",
  type: "stock_in",
  quantity: 1,
  note: "",
  reference: "",
};

const CatalogStudioPage = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingId, setEditingId] = useState("");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [movementForm, setMovementForm] = useState(initialMovementForm);

  const deferredSearch = useDeferredValue(search);

  const loadInventory = async () => {
    const searchParams = new URLSearchParams();
    if (deferredSearch) {
      searchParams.set("search", deferredSearch);
    }
    if (statusFilter) {
      searchParams.set("status", statusFilter);
    }
    if (categoryFilter) {
      searchParams.set("category", categoryFilter);
    }

    const query = searchParams.toString();
    const [categoryData, productData, movementData] = await Promise.all([
      apiRequest("/inventory/categories", { token }),
      apiRequest(`/inventory/products${query ? `?${query}` : ""}`, { token }),
      apiRequest("/inventory/movements", { token }),
    ]);

    startTransition(() => {
      setCategories(categoryData.categories);
      setProducts(productData.products);
      setMovements(movementData.movements);
      setError("");
      setLoading(false);
    });
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        setLoading(true);
        await loadInventory();
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
          setLoading(false);
        }
      }
    };

    boot();

    return () => {
      mounted = false;
    };
  }, [token, deferredSearch, statusFilter, categoryFilter]);

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleMovementChange = (event) => {
    const { name, value } = event.target;
    setMovementForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setEditingId("");
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setProductForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      category: product.category?._id || "",
      supplier: product.supplier,
      location: product.location,
      quantity: product.quantity,
      reorderLevel: product.reorderLevel,
      unitCost: product.unitCost,
      unitPrice: product.unitPrice,
    });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFeedback("");

      const method = editingId ? "PUT" : "POST";
      const path = editingId
        ? `/inventory/products/${editingId}`
        : "/inventory/products";

      const payload = {
        ...productForm,
        quantity: Number(productForm.quantity),
        reorderLevel: Number(productForm.reorderLevel),
        unitCost: Number(productForm.unitCost),
        unitPrice: Number(productForm.unitPrice),
      };

      await apiRequest(path, {
        method,
        token,
        body: payload,
      });

      setFeedback(editingId ? "Product updated successfully." : "Product added successfully.");
      resetProductForm();
      await loadInventory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const submitMovement = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFeedback("");
      await apiRequest(`/inventory/products/${movementForm.productId}/movement`, {
        method: "POST",
        token,
        body: {
          type: movementForm.type,
          quantity: Number(movementForm.quantity),
          note: movementForm.note,
          reference: movementForm.reference,
        },
      });

      setMovementForm(initialMovementForm);
      setFeedback("Stock movement saved successfully.");
      await loadInventory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <section className="content-panel">Loading inventory workspace...</section>;
  }

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.unitCost,
    0
  );
  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockCount = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel
  ).length;
  const outOfStockCount = products.filter((product) => product.quantity <= 0).length;
  const categoryCards = categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category?._id === category._id
    );

    return {
      ...category,
      itemCount: categoryProducts.length,
      quantity: categoryProducts.reduce((sum, product) => sum + product.quantity, 0),
    };
  });

  return (
    <section className="inventory-grid inventory-grid--enhanced">
      <article className="inventory-showcase">
        <div>
          <p className="eyebrow">Retail catalog studio</p>
          <h3>Manage clothes, skincare, and bags from one polished inventory desk.</h3>
          <p className="muted-copy">
            Filter faster, update product details, and record stock movement without losing
            sight of what needs replenishment next.
          </p>
        </div>
        <div className="mini-stats-grid">
          <div className="mini-stat">
            <span>Inventory value</span>
            <strong>{currencyFormatter.format(inventoryValue)}</strong>
          </div>
          <div className="mini-stat">
            <span>Units on hand</span>
            <strong>{totalUnits}</strong>
          </div>
          <div className="mini-stat">
            <span>Low stock</span>
            <strong>{lowStockCount}</strong>
          </div>
          <div className="mini-stat">
            <span>Out of stock</span>
            <strong>{outOfStockCount}</strong>
          </div>
        </div>
      </article>

      <article className="content-panel content-panel--wide">
        <div className="panel-header panel-header--tight">
          <div>
            <p className="eyebrow">Category shelf</p>
            <h3>Inventory mix by product range</h3>
          </div>
        </div>
        <div className="category-shelf">
          {categoryCards.map((category) => (
            <div className="shelf-card" key={category._id}>
              <div className="shelf-card__topline">
                <span
                  className="spotlight-card__dot"
                  style={{ background: category.accentColor }}
                />
                <strong>{category.name}</strong>
              </div>
              <p className="muted-copy">
                {category.itemCount} products / {category.quantity} units
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-panel inventory-list-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <p className="eyebrow">Catalog view</p>
            <h3>Products and availability</h3>
          </div>
          <div className="filters">
            <input
              className="soft-input"
              type="search"
              placeholder="Search name, SKU, supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="soft-input"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <select
              className="soft-input"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="feedback feedback--error">{error}</p> : null}
        {feedback ? <p className="feedback feedback--success">{feedback}</p> : null}

        <div className="table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Value</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No products match the current filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <strong>{product.name}</strong>
                      <p>
                        {product.sku} / {product.category?.name}
                      </p>
                      <p>{product.description}</p>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          product.status === "Low Stock"
                            ? "status-pill--low"
                            : product.status === "Out of Stock"
                              ? "status-pill--empty"
                              : ""
                        }`}
                      >
                        {product.quantity} units
                      </span>
                      <p>{product.status}</p>
                    </td>
                    <td>
                      <strong>{product.supplier}</strong>
                      <p>{product.location}</p>
                    </td>
                    <td>
                      <strong>
                        {currencyFormatter.format(product.quantity * product.unitCost)}
                      </strong>
                      <p>Selling at {currencyFormatter.format(product.unitPrice)}</p>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => editProduct(product)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="content-panel form-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <p className="eyebrow">Product editor</p>
            <h3>{editingId ? "Update a catalog item" : "Add a new product"}</h3>
          </div>
          {editingId ? (
            <button type="button" className="ghost-button" onClick={resetProductForm}>
              Clear
            </button>
          ) : null}
        </div>

        <p className="quick-note">
          Tip: use these starter ranges for boutique stock like clothes, skincare, and bags.
        </p>

        <form className="soft-form" onSubmit={submitProduct}>
          <div className="field-grid">
            <label>
              <span>Name</span>
              <input
                className="soft-input"
                name="name"
                value={productForm.name}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>SKU</span>
              <input
                className="soft-input"
                name="sku"
                value={productForm.sku}
                onChange={handleProductChange}
                required
              />
            </label>
            <label className="field-span-2">
              <span>Description</span>
              <textarea
                className="soft-input soft-textarea"
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
              />
            </label>
            <label>
              <span>Category</span>
              <select
                className="soft-input"
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Supplier</span>
              <input
                className="soft-input"
                name="supplier"
                value={productForm.supplier}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>Location</span>
              <input
                className="soft-input"
                name="location"
                value={productForm.location}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>Opening quantity</span>
              <input
                className="soft-input"
                type="number"
                min="0"
                name="quantity"
                value={productForm.quantity}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>Reorder level</span>
              <input
                className="soft-input"
                type="number"
                min="0"
                name="reorderLevel"
                value={productForm.reorderLevel}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>Unit cost</span>
              <input
                className="soft-input"
                type="number"
                min="0"
                name="unitCost"
                value={productForm.unitCost}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              <span>Unit price</span>
              <input
                className="soft-input"
                type="number"
                min="0"
                name="unitPrice"
                value={productForm.unitPrice}
                onChange={handleProductChange}
                required
              />
            </label>
          </div>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
          </button>
        </form>
      </article>

      <article className="content-panel form-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <p className="eyebrow">Stock movement</p>
            <h3>Log incoming, outgoing, or adjustments</h3>
          </div>
        </div>
        <form className="soft-form" onSubmit={submitMovement}>
          <div className="field-grid">
            <label className="field-span-2">
              <span>Product</span>
              <select
                className="soft-input"
                name="productId"
                value={movementForm.productId}
                onChange={handleMovementChange}
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Movement type</span>
              <select
                className="soft-input"
                name="type"
                value={movementForm.type}
                onChange={handleMovementChange}
              >
                <option value="stock_in">Stock in</option>
                <option value="stock_out">Stock out</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </label>
            <label>
              <span>Quantity</span>
              <input
                className="soft-input"
                type="number"
                name="quantity"
                value={movementForm.quantity}
                onChange={handleMovementChange}
                required
              />
            </label>
            <label>
              <span>Reference</span>
              <input
                className="soft-input"
                name="reference"
                value={movementForm.reference}
                onChange={handleMovementChange}
              />
            </label>
            <label>
              <span>Note</span>
              <input
                className="soft-input"
                name="note"
                value={movementForm.note}
                onChange={handleMovementChange}
              />
            </label>
          </div>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving..." : "Record movement"}
          </button>
        </form>
      </article>

      <article className="content-panel movement-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <p className="eyebrow">Recent log</p>
            <h3>Latest inventory entries</h3>
          </div>
        </div>
        <div className="stack-list">
          {movements.length === 0 ? (
            <p className="muted-copy">No movement records available yet.</p>
          ) : (
            movements.map((movement) => (
              <div className="list-row" key={movement._id}>
                <div>
                  <strong>{movement.product?.name}</strong>
                  <p>
                    {movement.type.replace("_", " ")} / {movement.quantity} units
                  </p>
                </div>
                <div>
                  <p className="muted-copy">{movement.reference || "No reference"}</p>
                  <p className="muted-copy">{formatDate(movement.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
};

export default CatalogStudioPage;
