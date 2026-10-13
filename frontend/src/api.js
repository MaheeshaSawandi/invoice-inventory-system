// All calls to the Spring Boot API go through this file.

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || `Request failed (${status})`);
    this.status = status;
    this.fieldErrors = body?.fieldErrors || {};
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError(0, {
      message: "Can't reach the server. Check that the Spring Boot app is running on port 8080.",
    });
  }

  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status >= 500 && !body) {
      throw new ApiError(res.status, {
        message: "Can't reach the server. Check that the Spring Boot app is running on port 8080.",
      });
    }
    throw new ApiError(res.status, body);
  }
  return body;
}

function query(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const productsApi = {
  list: (params) => request(`/products${query(params)}`),
  lowStock: () => request('/products/low-stock'),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const customersApi = {
  list: (params) => request(`/customers${query(params)}`),
  create: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
};
