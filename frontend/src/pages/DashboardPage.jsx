import { useEffect, useState } from "react";
import { currencyFormatter, formatDate, apiRequest } from "../api/client.js";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/dashboard/summary", { token });
        if (mounted) {
          setSummary(data);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      mounted = false;
    };
  }, [token]);

  if (loading) {
    return <section className="content-panel">Loading dashboard...</section>;
  }

  if (error) {
    return <section className="content-panel error-panel">{error}</section>;
  }

  if (!summary) {
    return <section className="content-panel">No summary data yet.</section>;
  }

  return (
    <section className="dashboard-grid">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Operations snapshot</p>
          <h3>See stock health, movement rhythm, and inventory value at a glance.</h3>
        </div>
        <div className="hero-panel__totals">
          <span>Monthly incoming: {summary.movementTotals.stockIn}</span>
          <span>Monthly outgoing: {summary.movementTotals.stockOut}</span>
          <span>Adjustments: {summary.movementTotals.adjustments}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Inventory Value"
          value={currencyFormatter.format(summary.overview.inventoryValue)}
          detail="Based on current unit cost and available stock."
          tone="sage"
        />
        <StatCard
          label="Products"
          value={summary.overview.totalProducts}
          detail="Active catalog records in the warehouse."
          tone="sky"
        />
        <StatCard
          label="Low Stock"
          value={summary.overview.lowStockCount}
          detail="Items at or below their reorder level."
          tone="peach"
        />
        <StatCard
          label="Out of Stock"
          value={summary.overview.outOfStockCount}
          detail="Items that need urgent replenishment."
          tone="sand"
        />
      </div>

      <article className="content-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Low stock focus</p>
            <h3>Items needing attention</h3>
          </div>
        </div>
        <div className="stack-list">
          {summary.lowStockProducts.length === 0 ? (
            <p className="muted-copy">Everything is comfortably above reorder level.</p>
          ) : (
            summary.lowStockProducts.map((product) => (
              <div className="list-row" key={product._id}>
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.sku} · {product.category?.name}
                  </p>
                </div>
                <div className="pill-group">
                  <span className="status-pill status-pill--low">{product.quantity} left</span>
                  <span className="status-pill">Reorder at {product.reorderLevel}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="content-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Category mix</p>
            <h3>Inventory spread</h3>
          </div>
        </div>
        <div className="category-bars">
          {summary.categoryBreakdown.map((category) => (
            <div className="category-bar" key={category.id}>
              <div className="category-bar__meta">
                <span>{category.name}</span>
                <span>{category.itemCount} items</span>
              </div>
              <div className="category-bar__track">
                <div
                  className="category-bar__fill"
                  style={{
                    width: `${Math.max(
                      12,
                      summary.overview.totalProducts
                        ? (category.itemCount / summary.overview.totalProducts) * 100
                        : 0
                    )}%`,
                    background: category.accentColor,
                  }}
                />
              </div>
              <p className="muted-copy">{category.quantity} units on hand</p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Recent movement</p>
            <h3>Latest stock activity</h3>
          </div>
        </div>
        <div className="stack-list">
          {summary.recentMovements.length === 0 ? (
            <p className="muted-copy">No movement data available yet.</p>
          ) : (
            summary.recentMovements.map((movement) => (
              <div className="list-row" key={movement._id}>
                <div>
                  <strong>{movement.product?.name}</strong>
                  <p>
                    {movement.type.replace("_", " ")} · {movement.quantity} units · by{" "}
                    {movement.performedBy?.name || "system"}
                  </p>
                </div>
                <p className="muted-copy">{formatDate(movement.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;

