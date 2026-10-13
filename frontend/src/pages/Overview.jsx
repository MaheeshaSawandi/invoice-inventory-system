import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customersApi, productsApi } from '../api.js';
import { money } from '../format.js';
import StockMeter from '../components/StockMeter.jsx';

export default function Overview() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        const [lowStock, products, customers] = await Promise.all([
          productsApi.lowStock(),
          productsApi.list({ size: 500 }),
          customersApi.list({ size: 1 }),
        ]);
        const stockValue = products.content.reduce(
          (sum, p) => sum + Number(p.unitPrice) * p.quantityInStock,
          0
        );
        setState({
          lowStock,
          productCount: products.totalElements,
          customerCount: customers.totalElements,
          stockValue,
        });
      } catch (err) {
        setState({ error: err.message });
      }
    })();
  }, []);

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="banner-error">{state.error}</p>;

  const { lowStock, productCount, customerCount, stockValue } = state;

  return (
    <section>
      <header className="page-head">
        <div>
          <h1>Overview</h1>
          <p className="page-sub">What needs your attention today.</p>
        </div>
      </header>

      <div className="reorder">
        <div className="reorder-head">
          <h2>
            {lowStock.length === 0
              ? 'Every product is above its reorder level'
              : `${lowStock.length} ${lowStock.length === 1 ? 'product needs' : 'products need'} reordering`}
          </h2>
          <Link to="/products" className="link">View all products</Link>
        </div>

        {lowStock.length > 0 && (
          <ul className="reorder-list">
            {lowStock.map((p) => (
              <li key={p.id}>
                <div>
                  <div className="cell-title">{p.name}</div>
                  <div className="cell-sub">{p.sku} · reorder at {p.reorderLevel}</div>
                </div>
                <StockMeter quantity={p.quantityInStock} reorderLevel={p.reorderLevel} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <dl className="facts">
        <div>
          <dt>Stock value at selling price</dt>
          <dd>{money(stockValue)}</dd>
        </div>
        <div>
          <dt>Products</dt>
          <dd>{productCount}</dd>
        </div>
        <div>
          <dt>Customers</dt>
          <dd>{customerCount}</dd>
        </div>
      </dl>
    </section>
  );
}
