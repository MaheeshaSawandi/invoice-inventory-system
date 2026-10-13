import { useCallback, useEffect, useState } from 'react';

/**
 * Loads one page of a list from the API, with search and paging.
 * Search waits 300 ms after the last key press before calling the API.
 */
export function useList(listFn, sort) {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listFn({ search: debounced, page, size: 10, sort });
      // If the last item on a page was deleted, step back one page.
      if (result.content.length === 0 && page > 0) {
        setPage(page - 1);
        return;
      }
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listFn, debounced, page, sort]);

  useEffect(() => {
    load();
  }, [load]);

  return { search, setSearch, searching: debounced, page, setPage, data, error, loading, reload: load };
}
