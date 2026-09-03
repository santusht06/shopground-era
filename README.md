# ShopGround Era — Enterprise E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.12-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.2-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Motor%203.3-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-5.0-DC382D?logo=redis&logoColor=white)](https://redis.io/)

**ShopGround Era** is a full-stack, enterprise-grade e-commerce application featuring a **Customer Store Front**, an **Admin Control Panel** (`admin.myapp.com`), and a **FastAPI backend** backed by **MongoDB** and **Redis**. Designed with the **`cloud.sharexpress.in` Light Theme** system (`#F4F5F8` background, `#FFFFFF` surface cards, `#5E6AD2` primary accent), it delivers high performance, glassmorphic visual excellence, micro‑interactions, and real‑time state management.

---

## 🏛️ System Architecture

```text
shopground-era/
├── frontend/             # Customer Store Front App (Targeting myapp.com)
├── admin-frontend/       # Admin Control Panel (Targeting admin.myapp.com)
└── backend/              # Asynchronous FastAPI REST API (MongoDB + Redis)
```

---

## ✨ Key Features & Capabilities

### 🛍️ Customer Store Front (`frontend/`)
- **Light Theme Design Tokens**: Custom utilities (`laser-glow-horizontal`, `glimmer-card`, `linear-shimmer-card`, `dot-grid`, slim custom scrollbars).
- **Glassmorphic Navigation Bar**: Real-time instant search dropdown preview with thumbnail previews, active route highlights, and an animated cart counter badge.
- **Dedicated Product Page URLs (`/product/:id`)**: Unique, deep‑linkable URLs featuring multi‑image viewer, low‑stock urgency alerts, tabbed specifications (**Overview**, **Technical Specs Table**, **Customer Reviews**), and related products.
- **Interactive Product Cards**: Instant Wishlist heart toggle, low‑stock urgency badges (`🔥 Low Stock (8 units)`), and quick‑view modals.
- **Cart Drawer & Free Shipping Goal**: Visual free shipping progress bar ("Add $25.00 more to unlock FREE Express Shipping!"), plus coupon discount calculation (`LOREM10` / `SHAREX20`).
- **Multi‑Step Checkout Simulation**: Multi‑step order placement modal (**Shipping Address** → **Payment Info** → **Order Confirmation**).
- **Unified Profile & Order Hub (`/profile`)**: Live order status tracking timelines (*Processing*, *Shipped*, *Delivered*), one‑click **Re‑Order Items** action, address book editor, and customer wishlist management.

### 🛡️ Admin Control Panel (`admin-frontend/`) — `admin.myapp.com`
- **Dashboard Control Panel**: Real‑time revenue KPI cards (`+14.2% Revenue`, `+8.1% Orders`), recent sales stream, and a **Restock Alert Widget** highlighting products with inventory under 10 units.
- **Product Inventory Center**: Searchable data table with category filter dropdowns, price sorting, stock status badges, and an **Add New Product** modal with image URL preview.
- **Order Fulfillment Center**: Orders management list with instant status updates (*Processing*, *Shipped*, *Delivered*, *Cancelled*).
- **Customer Directory**: Registered customer accounts listing with lifetime spend tracking.
- **System & CORS Configuration**: Live diagnostic connection verification for MongoDB, Redis, and target domain `admin.myapp.com`.

### ⚡ Backend API (`backend/`)
- **FastAPI Asynchronous Architecture**: Clean modular routing (`/api/v1/products`, `/api/v1/categories`, `/api/v1/cart`, `/api/v1/orders`, `/api/v1/health`).
- **MongoDB Async Integration**: Asynchronous database operations via Motor (`AsyncIOMotorClient`).
- **Redis Caching Layer**: Ultra‑fast product catalog caching and session state management.
- **CORS Setup**: Configured for multi‑domain production origins (`myapp.com`, `admin.myapp.com`).

---

## 🛠️ Tech Stack & Requirements

| Layer | Technology |
| :--- | :--- |
| **Frontend Stack** | React 19, Vite 8, Redux Toolkit, React Router v7, Tailwind CSS v4, Lucide Icons |
| **Admin Stack** | React 19, Vite 8, Redux Toolkit, Tailwind CSS v4, Lucide Icons |
| **Backend API** | Python 3.10+, FastAPI 0.110, Uvicorn, Pydantic V2, Pydantic Settings |
| **Database & Cache** | MongoDB (Motor async driver), Redis 7 (redis‑py) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have the following installed locally:
- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (Running on `mongodb://localhost:27017`)
- **Redis** (Running on `redis://localhost:6379`)

### 2. Running the Backend API
```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Seed initial MongoDB catalog data (Optional)
python seed_data.py

# Start Uvicorn development server
uvicorn app.main:app --reload --port 8000
```
- Interactive API Documentation: `http://localhost:8000/docs`
- Health Check Endpoint: `http://localhost:8000/api/v1/health`

### 3. Running the Customer Store Front
```bash
---

### 3. Running the Customer Store Front
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### 4. Running the Admin Control Panel
```bash
# Navigate to admin-frontend directory
cd admin-frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on port 5174)
npm run dev
```
Open `http://localhost:5174` in your browser.

---

## 🌐 Production Domain & CORS Deployment

In production environments:
- **Customer Frontend** should be hosted on `https://myapp.com`.
- **Admin Portal** should be hosted on `https://admin.myapp.com`.
- **Backend API** should be hosted on `https://api.myapp.com`.

### Nginx Reverse Proxy Example (Admin Portal)
```nginx
server {
    server_name admin.myapp.com;

    location / {
        root /var/www/shopground-era/admin-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📜 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check verifying MongoDB & Redis connection |
| `GET` | `/api/v1/products` | Retrieve catalog with search & category query filters |
| `GET` | `/api/v1/products/{id}` | Retrieve single product details by ID |
| `GET` | `/api/v1/categories` | Retrieve available category filter list |
| `POST` | `/api/v1/cart/sync` | Sync shopping cart state with Redis cache |
| `GET` | `/api/v1/orders` | Retrieve list of customer orders |
| `POST` | `/api/v1/orders` | Submit a new customer purchase order |

---

## 📄 License

This project is licensed under the Apache 2.0 License.
