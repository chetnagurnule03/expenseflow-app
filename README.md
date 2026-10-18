# ExpenseFlow — Personal Expense Tracker

A modern, fast, local-first personal expense tracker web application built with **React**, **Vite**, **TypeScript**, and **Recharts**.

## 🌟 Key Features
- **Local-First & Private:** Data persists locally using **IndexedDB** (`Dexie.js`) — zero external database required, 100% private.
- **Quick Logging:** Add income and expenses with amount, date, category, and notes in under a minute.
- **Interactive Monthly Budgeting:** Set a monthly budget with instant color-coded visual progress indicators and warnings when approaching or exceeding your limit.
- **Visual Analytics & Cashflow Trends:**
  - Smooth spline ComposedChart tracking income vs expenses with gradient fills.
  - Category breakdown donut charts with segment totals and percentages.
  - Interactive tooltip cards with Indian currency grouping (₹).
- **Search & Filtering:** Search by keyword, filter by category or transaction type, and date range filters.
- **Data Export & Demo Data:** Clean CSV export of records anytime, plus one-click demo data population.

## 🛠️ Stack
- **React 18** + **Vite** + **TypeScript**
- **Recharts** (smooth cashflow spline area charts & category donut charts)
- **Dexie.js** (IndexedDB browser persistence)
- **Lucide Icons** / SVG icons
- **Playful Bronze Theme:** Espresso (`#372C2E`), Cocoa (`#563727`), Mint (`#5ED3A6`), Coral (`#FF6B8A`), and Sunny (`#FFC857`).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/chetnagurnule03/expenseflow-app.git
cd expenseflow-app

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
