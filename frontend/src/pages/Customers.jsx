import { useState } from 'react';
import { customersApi } from '../api.js';
import { useList } from './useList.js';
import { useToast } from '../components/useToast.jsx';
import Modal from '../components/Modal.jsx';
import Pager from '../components/Pager.jsx';
import CustomerForm from './CustomerForm.jsx';

export default function Customers() {
  const list = useList(customersApi.list, 'name,asc');
  const [editing, setEditing] = useState(null);
  const [toast, showToast] = useToast();

  async function save(data) {
    if (editing.id) {
      await customersApi.update(editing.id, data);
      showToast('Customer saved');
    } else {
      await customersApi.create(data);
      showToast('Customer added');
    }
    setEditing(null);
    list.reload();
  }

  async function remove(customer) {
    if (!window.confirm(`Delete "${customer.name}"? This can't be undone.`)) return;
    try {
      await customersApi.remove(customer.id);
      showToast('Customer deleted');
      list.reload();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <section>
      <header className="page-head">
        <div>
          <h1>Customers</h1>
          <p className="page-sub">The people and businesses you send invoices to.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>Add customer</button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search customers by name"
          value={list.search}
          onChange={(e) => list.setSearch(e.target.value)}
          aria-label="Search customers"
        />
      </div>

      {list.error && <p className="banner-error">{list.error}</p>}
      {!list.data && !list.error && <p className="muted">Loading…</p>}

      {list.data && list.data.content.length === 0 ? (
        <div className="empty">
          {list.searching ? (
            <p>No customers match “{list.searching}”.</p>
          ) : (
            <>
              <p>No customers yet. Add a customer so you can invoice them.</p>
              <button className="btn btn-primary" onClick={() => setEditing({})}>Add customer</button>
            </>
          )}
        </div>
      ) : (
        list.data && (
          <div className="table-wrap">
            <table className={list.loading ? 'is-loading' : ''}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th className="col-address">Address</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {list.data.content.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="cell-title">{c.name}</div>
                      <div className="cell-sub">{c.email}</div>
                    </td>
                    <td className="tabular">{c.phone || '—'}</td>
                    <td className="col-address">{c.address || '—'}</td>
                    <td className="row-actions">
                      <button className="btn btn-quiet" onClick={() => setEditing(c)}>Edit</button>
                      <button className="btn btn-quiet btn-danger" onClick={() => remove(c)}>Delete</button>
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
               totalElements={list.data.totalElements} onChange={list.setPage} noun="customer" />
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit customer' : 'Add customer'} onClose={() => setEditing(null)}>
          <CustomerForm customer={editing.id ? editing : null} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {toast}
    </section>
  );
}
