export default function Pager({ page, totalPages, totalElements, onChange, noun }) {
  if (totalElements === 0) return null;
  return (
    <div className="pager">
      <span>
        {totalElements} {totalElements === 1 ? noun : `${noun}s`}
      </span>
      {totalPages > 1 && (
        <div className="pager-btns">
          <button className="btn btn-quiet" disabled={page === 0} onClick={() => onChange(page - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button className="btn btn-quiet" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
