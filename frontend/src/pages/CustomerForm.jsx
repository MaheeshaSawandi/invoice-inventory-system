import { useState } from 'react';
import Field from '../components/Field.jsx';
import { ApiError } from '../api.js';

const EMPTY = { name: '', email: '', phone: '', address: '' };

export default function CustomerForm({ customer, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    customer
      ? { name: customer.name, email: customer.email, phone: customer.phone ?? '', address: customer.address ?? '' }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(null);
    try {
      await onSubmit({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address || null,
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
        <Field label="Business or customer name" name="name" value={values.name} onChange={change}
               error={errors.name} className="span-2" autoFocus />
        <Field label="Email" name="email" type="email" value={values.email} onChange={change} error={errors.email} />
        <Field label="Phone" name="phone" type="tel" value={values.phone} onChange={change} error={errors.phone}
               hint="e.g. 0771234567" />
        <Field label="Address" name="address" as="textarea" rows={2} value={values.address} onChange={change}
               error={errors.address} className="span-2" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : customer ? 'Save changes' : 'Add customer'}
        </button>
      </div>
    </form>
  );
}
