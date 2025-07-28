# Crypto Dashboard Frontend

## Overview
This React app displays a dashboard of the top 10 cryptocurrencies, with live data, search, sorting, and historical price charts. Users can also save price snapshots to the backend database.

## Features
- View top 10 cryptocurrencies (name, symbol, price, market cap, 24h % change, last updated)
- Search and sort coins
- Save a snapshot of current prices to the backend
- View historical price charts for each coin (powered by Chart.js)
- Responsive, modern UI with Navbar and Footer

## Tech Stack
- React
- Axios (API requests)
- Chart.js & react-chartjs-2 (charts)
- Custom CSS (no Tailwind)

## How It Works
- Fetches live data from backend (`/api/coins`)
- "Save Snapshot" button calls backend (`/api/history`) to store current prices
- "Show Chart" button fetches historical data (`/api/history/:coinId`) and displays a chart
- Auto-refreshes every 30 minutes

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Make sure the backend is running at `http://localhost:5000`

## Folder Structure
- `src/App.js` — Main dashboard logic
- `src/Navbar.js` & `src/Navbar.css` — Navigation bar
- `src/Footer.js` & `src/Footer.css` — Footer
- `src/App.css` — Main styles

---

For backend/API setup, see the backend README.
