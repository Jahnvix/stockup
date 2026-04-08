const StatCard = ({ label, value, detail, tone = "sage" }) => (
  <article className={`stat-card stat-card--${tone}`}>
    <p className="stat-card__label">{label}</p>
    <h3>{value}</h3>
    <p className="stat-card__detail">{detail}</p>
  </article>
);

export default StatCard;

