/**
 * Shows stock as a bar with a tick at the reorder level,
 * so you can see at a glance how close a product is to running out.
 */
export default function StockMeter({ quantity, reorderLevel }) {
  const scale = Math.max(quantity, reorderLevel * 3, 1);
  const fill = Math.min(100, (quantity / scale) * 100);
  const tick = Math.min(100, (reorderLevel / scale) * 100);
  const state = quantity === 0 ? 'out' : quantity <= reorderLevel ? 'low' : 'ok';
  const label =
    state === 'out' ? 'Out of stock' : state === 'low' ? 'Reorder now' : 'In stock';

  return (
    <div className={`meter meter-${state}`}>
      <div className="meter-top">
        <span className="meter-qty">{quantity}</span>
        <span className="meter-label">{label}</span>
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-valuenow={quantity}
        aria-valuemin={0}
        aria-valuemax={scale}
        aria-label={`${quantity} in stock, reorder at ${reorderLevel}`}
      >
        <div className="meter-fill" style={{ width: `${fill}%` }} />
        <div className="meter-tick" style={{ left: `${tick}%` }} title={`Reorder at ${reorderLevel}`} />
      </div>
    </div>
  );
}
