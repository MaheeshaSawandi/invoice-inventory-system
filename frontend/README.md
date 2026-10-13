# Stockbook — React frontend

A React frontend for the Invoice & Inventory System API. It shows stock levels at a glance, warns when products need reordering, and lets you manage products and customers.

## Tech stack

- React 18 + Vite
- React Router
- Plain CSS (no UI library)
- Fetch API, with the Vite dev proxy forwarding `/api` to Spring Boot on port 8080

## Features

- **Overview:** products that need reordering, total stock value, and product and customer counts
- **Products:** search, paging, add/edit in a popup form, delete, and a stock meter showing quantity against the reorder level
- **Customers:** search, paging, add/edit, delete
- Validation errors from the API appear under the matching form field
- Works on phone screens

## Run locally

1. Start the Spring Boot backend first (it must be running on port 8080).
2. Then:

```bash
cd frontend
npm install
npm run dev
```

3. Open http://localhost:5173

## Folder structure

```
src/
├── api.js            all calls to the backend
├── format.js         money formatting (Rs.)
├── App.jsx           layout + routes
├── components/       StockMeter, Modal, Field, Pager, useToast
└── pages/            Overview, Products, Customers, forms, useList (search + paging)
```
