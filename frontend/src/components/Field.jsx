/** A labelled input that shows the error message the API sent back for this field. */
export default function Field({ label, name, error, hint, as = 'input', className = '', ...props }) {
  const Tag = as;
  const id = `f-${name}`;
  return (
    <label className={`field ${className} ${error ? 'has-error' : ''}`} htmlFor={id}>
      <span className="field-label">{label}</span>
      <Tag id={id} name={name} aria-invalid={!!error} {...props} />
      {error ? <span className="field-error">{error}</span> : hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
