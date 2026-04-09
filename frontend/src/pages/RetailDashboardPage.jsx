import { useEffect, useState } from "react";
import { currencyFormatter, formatDate, apiRequest } from "../api/client.js";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RetailDashboardPage = () => {
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

  const totalUnits = summary.categoryBreakdown.reduce(
    (sum, category) => sum + category.quantity,
    0
  );
  const healthyCount =
    summary.overview.totalProducts -
    summary.overview.lowStockCount -
    summary.overview.outOfStockCount;
  const healthRatio = summary.overview.totalProducts
    ? Math.round((healthyCount / summary.overview.totalProducts) * 100)
    : 0;
  const topCategory = summary.categoryBreakdown
    .slice()
    .sort((left, right) => right.quantity - left.quantity)[0];
  const chartPeak = Math.max(...summary.categoryBreakdown.map((category) => category.quantity), 1);
  const attentionItems = [
    ...summary.outOfStockProducts,
    ...summary.lowStockProducts.filter(
      (product) => !summary.outOfStockProducts.some((empty) => empty._id === product._id)
    ),
  ];

  return (
    <section className="dashboard-grid">
      <article className="dashboard-banner">
        <div>
          <p className="eyebrow">Brand overview</p>
          <h3>Keep curated collections ready for the next shopper.</h3>
          <p className="muted-copy">
            SoftStock brings clothes, skincare, and bags into a single inventory rhythm
            with live stock value, replenishment focus, and movement history.
          </p>
          <div className="feature-pill-grid">
            <div className="feature-pill">
              <span>Active categories</span>
              <strong>{summary.overview.activeCategories}</strong>
            </div>
            <div className="feature-pill">
              <span>Units on hand</span>
              <strong>{totalUnits}</strong>
            </div>
            <div className="feature-pill">
              <span>Top range</span>
              <strong>{topCategory?.name || "N/A"}</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel__totals hero-panel__totals--stacked">
          <span>
            <strong>{currencyFormatter.format(summary.overview.inventoryValue)}</strong>
            <small>Current stock value</small>
          </span>
          <span>
            <strong>{summary.movementTotals.stockIn}</strong>
            <small>Units received</small>
          </span>
          <span>
            <strong>{summary.movementTotals.stockOut}</strong>
            <small>Units dispatched</small>
          </span>
          <span>
            <strong>{summary.overview.lowStockCount + summary.overview.outOfStockCount}</strong>
            <small>Items needing review</small>
          </span>
        </div>
      </article>

      <div className="stats-grid stats-grid--floating">
        <StatCard
          label="Inventory Value"
          value={currencyFormatter.format(summary.overview.inventoryValue)}
          detail="Based on current unit cost and available stock."
          tone="sage"
        />
        <StatCard
          label="Products"
          value={summary.overview.totalProducts}
          detail="Curated records in the live boutique catalog."
          tone="sky"
        />
        <StatCard
          label="Low Stock"
          value={summary.overview.lowStockCount}
          detail="Items close to their reorder threshold."
          tone="peach"
        />
        <StatCard
          label="Out of Stock"
          value={summary.overview.outOfStockCount}
          detail="Products waiting on replenishment."
          tone="sand"
        />
      </div>

      <article className="content-panel chart-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Movement overview</p>
            <h3>Inventory spread by category</h3>
          </div>
          <span className="status-pill">Updated live</span>
        </div>
        <div className="activity-chart">
          {summary.categoryBreakdown.map((category) => {
            const share = summary.overview.totalProducts
              ? Math.round((category.itemCount / summary.overview.totalProducts) * 100)
              : 0;

            return (
              <div className="activity-chart__column" key={category.id}>
                <div className="activity-chart__bar-wrap">
                  <div
                    className="activity-chart__bar"
                    style={{
                      height: `${Math.max(26, (category.quantity / chartPeak) * 100)}%`,
                      background: category.accentColor,
                    }}
                  />
                </div>
                <strong>{category.quantity}</strong>
                <span>{category.name}</span>
                <small>{share}% of catalog</small>
              </div>
            );
          })}
        </div>
      </article>

      <article className="content-panel orbit-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Stock health</p>
            <h3>Healthy versus attention-needed items</h3>
          </div>
        </div>
        <div className="health-orbit">
          <div
            className="health-orbit__ring"
            style={{
              background: `conic-gradient(#7bb196 0 ${healthRatio}%, rgba(123, 177, 150, 0.16) ${healthRatio}% 100%)`,
            }}
          >
            <div className="health-orbit__center">
              <strong>{healthRatio}%</strong>
              <span>Healthy stock</span>
            </div>
          </div>
          <div className="health-orbit__legend">
            <div>
              <span className="legend-dot legend-dot--green" />
              <p>
                <strong>{healthyCount}</strong>
                <small>Well stocked</small>
              </p>
            </div>
            <div>
              <span className="legend-dot legend-dot--rose" />
              <p>
                <strong>{summary.overview.lowStockCount}</strong>
                <small>Low stock</small>
              </p>
            </div>
            <div>
              <span className="legend-dot legend-dot--sand" />
              <p>
                <strong>{summary.overview.outOfStockCount}</strong>
                <small>Out of stock</small>
              </p>
            </div>
          </div>
        </div>
        <p className="quick-note">
          Fastest-moving category right now: <strong>{topCategory?.name || "N/A"}</strong>
        </p>
      </article>

      <article className="content-panel content-panel--wide range-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Product ranges</p>
            <h3>Collections performing across the dashboard</h3>
          </div>
        </div>
        <div className="range-showcase">
          {summary.categoryBreakdown.map((category) => (
            <div
              className="range-card"
              key={category.id}
              style={{ "--range-accent": category.accentColor }}
            >
              <div className="range-card__visual">
                <span>{category.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="range-card__meta">
                <strong>{category.name}</strong>
                <p>{category.itemCount} listed products</p>
                <div className="range-card__stats">
                  <span>{category.quantity} units</span>
                  <span>{currencyFormatter.format(category.quantity * 650)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="content-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Reorder radar</p>
            <h3>Items that need the next stock decision</h3>
          </div>
        </div>
        <div className="stack-list">
          {attentionItems.length === 0 ? (
            <p className="muted-copy">Everything is comfortably above reorder level.</p>
          ) : (
            attentionItems.map((product) => (
              <div className="list-row" key={product._id}>
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.sku} / {product.category?.name}
                  </p>
                </div>
                <div className="pill-group">
                  <span
                    className={`status-pill ${
                      product.quantity <= 0 ? "status-pill--empty" : "status-pill--low"
                    }`}
                  >
                    {product.quantity <= 0 ? "Out of stock" : `${product.quantity} left`}
                  </span>
                  <span className="status-pill">Reorder at {product.reorderLevel}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="content-panel content-panel--wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Movement timeline</p>
            <h3>Latest stock activity</h3>
          </div>
        </div>
        <div className="timeline-list">
          {summary.recentMovements.length === 0 ? (
            <p className="muted-copy">No movement data available yet.</p>
          ) : (
            summary.recentMovements.map((movement) => (
              <div className="timeline-item" key={movement._id}>
                <div className="timeline-item__marker" />
                <div className="timeline-item__body">
                  <div className="timeline-item__topline">
                    <strong>{movement.product?.name}</strong>
                    <span className="muted-copy">{formatDate(movement.createdAt)}</span>
                  </div>
                  <p className="muted-copy">
                    {movement.type.replace("_", " ")} / {movement.quantity} units / by{" "}
                    {movement.performedBy?.name || "system"}
                  </p>
                  <p className="muted-copy">{movement.reference || "No reference"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
};

export default RetailDashboardPage;
