# Dinora Frontend

React + Vite frontend for the Dinora dine-in ordering platform.

## Structure

- `src/components` shared UI and navigation
- `src/features/cart` guest cart persistence
- `src/hooks` reusable React hooks
- `src/layouts` guest/admin shells
- `src/pages/guest` table, menu, cart and order flows
- `src/pages/auth` admin authentication
- `src/pages/admin` restaurant management
- `src/pages/counter` kitchen/counter view
- `src/services` API client
- `src/utils` routing and formatting helpers

## Run

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the API is not on the current host's port 8000.

## Production

```bash
npm run build
```

Deploy `dist/` to Vercel. Configure `VITE_API_URL` to the public FastAPI URL.

## Security

Never commit `.env` files or secrets. The browser must only receive public configuration such as the API base URL.
