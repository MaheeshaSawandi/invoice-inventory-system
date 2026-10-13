import { useState } from 'react';
import Field from '../components/Field.jsx';
import { ApiError } from '../api.js';

const EMPTY = { sku: '', name: '', description: '', unitPrice: '', quantityInStock: '', reorderLevel: '' };

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    product
      ? {
          sku: product.sku,
          name: product.name,
          description: product.description ?? '',
          unitPrice: product.unitPrice,
          quantityInStock: product.quantityInStock,
          reorderLevel: product.reorderLevel,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const toNumber = (v) => (v === '' ? null : Number(v));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(null);
    try {
      await onSubmit({
        sku: values.sku,
        name: values.name,
        description: values.description || null,
        unitPrice: toNumber(values.unitPrice),
        quantityInStock: toNumber(values.quantityInStock),
        reorderLevel: toNumber(values.reorderLevel),
      });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
      } else {
        setFormError(err.message);
      }
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      {formError && <p className="form-error">{formError}</p>}
      <div className="form-grid">
        <Field label="SKU" name="sku" value={values.sku} onChange={change} error={errors.sku}
               hint="A short unique code, e.g. PEN-BLU-001" autoFocus />
        <Field label="Product name" name="name" value={values.name} onChange={change} error={errors.name} />
        <Field label="Description" name="description" as="textarea" rows={2} value={values.description}
               onChange={change} error={errors.description} className="span-2" />
        <Field label="Unit price (Rs.)" name="unitPrice" type="number" step="0.01" min="0"
               value={values.unitPrice} onChange={change} error={errors.unitPrice} />
        <Field label="Quantity in stock" name="quantityInStock" type="number" min="0"
               value={values.quantityInStock} onChange={change} error={errors.quantityInStock} />
        <Field label="Reorder level" name="reorderLevel" type="number" min="0"
               value={values.reorderLevel} onChange={change} error={errors.reorderLevel}
               hint="You'll be warned when stock reaches this number" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}
