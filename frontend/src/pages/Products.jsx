import { useState } from 'react';
import { productsApi } from '../api.js';
import { money } from '../format.js';
import { useList } from './useList.js';
import { useToast } from '../components/useToast.jsx';
import Modal from '../components/Modal.jsx';
import Pager from '../components/Pager.jsx';
import StockMeter from '../components/StockMeter.jsx';
import ProductForm from './ProductForm.jsx';

export default function Products() {
  const list = useList(productsApi.list, 'name,asc');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
  const [toast, showToast] = useToast();

  async function save(data) {
    if (editing.id) {
      await productsApi.update(editing.id, data);
      showToast('Product saved');
    } else {
      await productsApi.create(data);
      showToast('Product added');
    }
    setEditing(null);
    list.reload();
  }

  async function remove(product) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await productsApi.remove(product.id);
      showToast('Product deleted');
      list.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <section>
      <header className="page-head">
        <div>
          <h1>Products</h1>
          <p className="page-sub">Prices, stock on hand and when to reorder.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>Add product</button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search products by name"
          value={list.search}
          onChange={(e) => list.setSearch(e.target.value)}
          aria-label="Search products"
        />
      </div>

      {list.error && <p className="banner-error">{list.error}</p>}
      {!list.data && !list.error && <p className="muted">Loading…</p>}

      {list.data && list.data.content.length === 0 ? (
        <div className="empty">
          {list.searching ? (
            <p>No products match “{list.searching}”.</p>
          ) : (
            <>
              <p>No products yet. Add your first product to start tracking stock.</p>
              <button className="btn btn-primary" onClick={() => setEditing({})}>Add product</button>
            </>
          )}
        </div>
      ) : (
        list.data && (
          <div className="table-wrap">
            <table className={list.loading ? 'is-loading' : ''}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="num">Unit price</th>
                  <th className="col-stock">Stock</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {list.data.content.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="cell-title">{p.name}</div>
                      <div className="cell-sub">{p.sku}</div>
                    </td>
                    <td className="num">{money(p.unitPrice)}</td>
                    <td className="col-stock">
                      <StockMeter quantity={p.quantityInStock} reorderLevel={p.reorderLevel} />
                    </td>
                    <td className="row-actions">
                      <button className="btn btn-quiet" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-quiet btn-danger" onClick={() => remove(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {list.data && (
        <Pager page={list.data.page} totalPages={list.data.totalPages}
               totalElements={list.data.totalElements} onChange={list.setPage} noun="product" />
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit product' : 'Add product'} onClose={() => setEditing(null)}>
          <ProductForm product={editing.id ? editing : null} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {toast}
    </section>
  );
}
