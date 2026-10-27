# TATVA Nutrition — Pure by Principle.
### Full-Stack Sports Nutrition E-Commerce Web Application (CA-03 Academic Prototype)

**Repository Target:** `25070521204-CA-03`  
**Project Root Directory:** `25070521204`  
**Brand:** TATVA Nutrition  
**Tagline:** Pure by Principle.  

---

## 1. Project Overview

**TATVA Nutrition** is an academic prototype of a full-stack e-commerce web application dedicated to sports nutrition, dietary supplements, and gym accessories. The application provides an end-to-end shopping journey including dynamic product discovery, attribute-based filtering, product comparison, a deterministic smart product finder, JWT-based customer authentication, shopping cart management, simulated checkout, order tracking, community product reviews, and an administrative inventory and order management dashboard.

> **Academic Notice:** All nutrition values, ingredients, supplement descriptions, and product prices presented in this project are illustrative demonstration data created solely for academic evaluation in CA-03. They do not constitute verified clinical nutritional claims or commercial offers.

---

## 2. Problem Statement

Modern sports supplement consumers frequently encounter deceptive proprietary blends, unverified filler ingredients, and chaotic e-commerce interfaces. TATVA Nutrition demonstrates a clean, transparent digital storefront with disciplined aesthetics (warm cream, charcoal, muted olive, and bronze accents), verified database transactions, real-time stock validations, and deterministic rule-based supplement discovery.

---

## 3. Project Objectives

1. Develop a responsive, component-driven frontend in **React** using **Vite**.
2. Construct a modular, secure REST API backend using **Node.js** and **Express.js**.
3. Persist and manage application entities (Users, Products, Carts, Orders, Reviews, Wishlists) in **MongoDB** via **Mongoose**, manageable via **MongoDB Compass**.
4. Enforce secure JWT authentication, bcrypt password hashing, and role-based access control.
5. Provide a deterministic **Smart Product Finder** and a **Side-by-Side Product Comparison** tool.
6. Provide simulated checkout with real database persistence, stock decrement, and zero collection of real financial credentials.
7. Provide an administrative dashboard for inventory, order status transitions, and review moderation.

---

## 4. Technology Stack

### Frontend
- **Framework:** React 19 / 18 + Vite
- **Routing:** React Router v7 / v6
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **Styling:** Vanilla CSS with custom tokens (warm cream, charcoal, muted olive green, bronze)
- **Icons:** SVG assets and Lucide React

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security:** `helmet`, `express-rate-limit`, `cors`
- **Configuration:** `dotenv`

---

## 5. Key Features

- **Storefront Home:** Hero poster showcase, category shortcuts, athlete favorites, brand philosophy, and interactive newsletter feedback.
- **Product Catalogue (`/shop`):** Real-time search, category filters, price range filter, multi-criteria sorting, and responsive product cards.
- **Product Details (`/products/:slug`):** Image gallery, specifications chips, stock counter, quantity selector, tabs for description/sample nutrition/reviews, and related products.
- **Smart Product Finder (`/product-finder`):** Rule-based recommendation engine scoring products based on goal category, budget slider, dietary preference, and flavor, with transparent match explanations.
- **Product Comparison (`/compare`):** Side-by-side comparison matrix of up to 3 products across specifications, price, and sample nutrition.
- **Wishlist (`/wishlist`):** MongoDB-persisted saved supplements with instant move-to-cart actions.
- **Shopping Cart (`/cart`):** Synchronized database cart with free-shipping milestone progress bar (₹999 threshold), quantity adjustment, and live price recalculations.
- **Simulated Checkout (`/checkout`):** Clear academic simulation notice; customer contact & shipping form; Simulated Cash on Delivery and Simulated Online Payment modes.
- **Order Confirmation & Tracking (`/orders`):** Database-generated order reference numbers (`TATVA-ORD-XXXXXXXX-XXX`), status tracking (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and customer cancellation with inventory stock restoration.
- **Admin Dashboard (`/admin`):** Protected route displaying aggregated metrics (revenue, order count, product count, customer count), low-stock alerts, inline stock editing, product activation toggle, new product creation modal, order status updater, and review moderation.

---

## 6. User Roles

1. **Customer (Default):**
   - Browse catalogue, search, filter, and compare products.
   - Use Smart Product Finder.
   - Register and login.
   - Manage cart, wishlist, and profile address.
   - Place simulated orders and track status.
   - Submit 1 review per product.
2. **Administrator:**
   - All customer privileges.
   - Access to `/admin` dashboard.
   - Create, edit, and toggle active status of products.
   - Update stock quantities.
   - Manage order status transitions.
   - Delete inappropriate customer reviews.

---

## 7. Folder Structure

```
25070521204/
├── .gitignore
├── README.md
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── images/
│   │       ├── tatva-whey-isolate.svg (.png)
│   │       ├── tatva-micronized-creatine.svg (.png)
│   │       ├── tatva-peanut-butter.svg (.png)
│   │       ├── tatva-protein-shaker.svg (.png)
│   │       ├── tatva-pre-workout.svg (.png)
│   │       ├── tatva-protein-oats.svg (.png)
│   │       └── tatva-main-poster.svg (.png)
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductGrid.jsx
│       │   ├── PriceDisplay.jsx
│       │   ├── RatingDisplay.jsx
│       │   ├── QuantitySelector.jsx
│       │   ├── RouteGuards.jsx
│       │   └── UIFeedback.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── WishlistContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Shop.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── ProductFinder.jsx
│       │   ├── Compare.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── OrderConfirmation.jsx
│       │   ├── MyOrders.jsx
│       │   ├── Account.jsx
│       │   ├── Wishlist.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── AdminDashboard.jsx
│       └── services/
│           └── api.js
└── server/
    ├── .env
    ├── .env.example
    ├── package.json
    └── src/
        ├── server.js
        ├── config/
        │   └── db.js
        ├── controllers/
        │   ├── authController.js
        │   ├── productController.js
        │   ├── cartController.js
        │   ├── wishlistController.js
        │   ├── orderController.js
        │   ├── reviewController.js
        │   ├── finderController.js
        │   └── adminController.js
        ├── middleware/
        │   └── auth.js
        ├── models/
        │   ├── User.js
        │   ├── Product.js
        │   ├── Cart.js
        │   ├── Order.js
        │   ├── Review.js
        │   └── Wishlist.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── productRoutes.js
        │   ├── cartRoutes.js
        │   ├── wishlistRoutes.js
        │   ├── orderRoutes.js
        │   ├── reviewRoutes.js
        │   ├── finderRoutes.js
        │   └── adminRoutes.js
        ├── scripts/
        │   ├── seed.js
        │   ├── seedAdmin.js
        │   └── generateAssets.js
        └── utils/
            └── token.js
```

---

## 8. Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB Community Server:** Running on `127.0.0.1:27017`
- **MongoDB Compass:** Graphical management tool (connect to `mongodb://127.0.0.1:27017`)

---

## 9. Environment Variable Setup

### Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/tatva_nutrition
JWT_SECRET=tatva_super_secure_academic_jwt_secret_token_2026_spring
ADMIN_NAME=TATVA Administrator
ADMIN_EMAIL=admin@tatvanutrition.com
ADMIN_PASSWORD=Admin@Tatva2026!
```

### Frontend Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 10. Database Seeding & MongoDB Compass

Ensure your local MongoDB instance is running, then run the repeatable seed scripts from the `server` directory:

```powershell
# 1. Seed initial 6 products (Upsert by slug - safe to run multiple times)
npm.cmd run seed

# 2. Seed default administrator account
npm.cmd run seed:admin
```

### Seeded Catalogue Items
1. **TATVA Whey Isolate Protein Powder** (`whey-isolate-chocolate`) — ₹2,499
2. **TATVA Micronized Creatine** (`micronized-creatine`) — ₹699
3. **TATVA Peanut Butter** (`peanut-butter-creamy`) — ₹399
4. **TATVA Protein Shaker Bottle** (`protein-shaker`) — ₹299
5. **TATVA Pre-Workout** (`pre-workout-fruit-punch`) — ₹899
6. **TATVA Protein Oats** (`protein-oats-chocolate-banana`) — ₹349

### Default Administrator Account
- **Email:** `admin@tatvanutrition.com`
- **Password:** `Admin@Tatva2026!`

In **MongoDB Compass**, connect to `mongodb://127.0.0.1:27017` and inspect the `tatva_nutrition` database to observe collections: `users`, `products`, `carts`, `orders`, `reviews`, and `wishlists`.

---

## 11. PowerShell Run Instructions

Open two separate Windows PowerShell windows.

### Terminal 1 — Backend API Server
```powershell
cd c:\Users\Lenovo\Desktop\25070521204\server
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```
*Expected Output:*
```
TATVA Nutrition API Server is running!
Tagline: Pure by Principle.
URL: http://localhost:5000
Health Check: http://localhost:5000/api/health
```

### Terminal 2 — Frontend Client
```powershell
cd c:\Users\Lenovo\Desktop\25070521204\client
npm.cmd install
npm.cmd run dev
```
*Expected Output:*
```
VITE v8.x ready in ... ms
➜ Local: http://localhost:5173/
```

Open your browser to `http://localhost:5173/`.

---

## 12. REST API Specification Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server & MongoDB connection status |
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT |
| `GET` | `/api/auth/me` | Protected | Current user profile |
| `PATCH` | `/api/auth/profile` | Protected | Update profile & address |
| `GET` | `/api/products` | Public | Search, filter, and paginate products |
| `GET` | `/api/products/featured` | Public | Featured products |
| `GET` | `/api/products/:slug` | Public | Single product details |
| `GET` | `/api/products/compare` | Public | Compare up to 3 products |
| `POST` | `/api/products` | Admin | Create product |
| `PATCH` | `/api/products/:id/stock` | Admin | Adjust product inventory |
| `PATCH` | `/api/products/:id/status` | Admin | Toggle active/inactive |
| `GET` | `/api/cart` | Protected | Fetch customer cart with recalculated totals |
| `POST` | `/api/cart/items` | Protected | Add item to cart |
| `PATCH` | `/api/cart/items/:id` | Protected | Update item quantity |
| `DELETE` | `/api/cart/items/:id` | Protected | Remove item from cart |
| `GET` | `/api/wishlist` | Protected | Get saved wishlist items |
| `POST` | `/api/wishlist/:id` | Protected | Toggle item in wishlist |
| `POST` | `/api/orders` | Protected | Place simulated order (decrements stock) |
| `GET` | `/api/orders/my` | Protected | View user's own orders |
| `POST` | `/api/orders/:id/cancel`| Protected | Cancel order & restore stock |
| `GET` | `/api/orders/admin/all` | Admin | View all customer orders |
| `PATCH`| `/api/orders/admin/:id/status` | Admin | Update order status |
| `GET` | `/api/reviews/product/:id` | Public | Get product community reviews |
| `POST` | `/api/reviews/product/:id` | Protected | Submit 1-5 star review (1 per user) |
| `GET` | `/api/product-finder` | Public | Rule-based recommendation engine |
| `GET` | `/api/admin/dashboard` | Admin | Aggregated database business metrics |

---

## 13. Simulated Checkout Explanation

This application provides a **simulated checkout** for coursework evaluation.
- Two demonstration payment methods are offered: **Simulated Cash on Delivery** and **Simulated Online Payment**.
- Card numbers, expiration dates, CVVs, UPI PINs, or banking passwords are **never** requested, stored, or processed.
- When an order is placed, the backend verifies real product stock, calculates prices using trusted database records, decrements stock, records the order in MongoDB with a unique identifier (`TATVA-ORD-XXXXXXXX-XXX`), and empties the cart.

---

## 14. Verification and Test Results

- **Structure Check:** Verified `client` and `server` folders exist directly at root `25070521204`.
- **Frontend Production Build:** `npm run build` executed and succeeded cleanly in 3.03s with 50 modules transformed and zero bundle errors.
- **Backend Syntax Check:** `node --check src/server.js` passed with zero errors.
- **Backend API Health Check:** `GET http://localhost:5000/api/health` returned `HTTP 200 OK` with truthful JSON status.
- **Frontend Development Server:** `GET http://localhost:5173` returned `HTTP 200 OK`.
- **Asset Generation:** 6 distinct product assets and poster generated in `client/public/images/`.

---

## 15. GitHub Preparation & Submission Instructions

To push this project to your repository `25070521204-CA-03`:

```powershell
# Navigate to project root
cd c:\Users\Lenovo\Desktop\25070521204

# Initialize Git repository (if not already initialized)
git init

# Review untracked files (verify node_modules and .env are excluded by .gitignore)
git status

# Stage all files
git add .

# Create initial submission commit
git commit -m "Complete TATVA Nutrition CA-03 Full-Stack Application"

# Add your GitHub remote repository
git remote add origin https://github.com/<your-username>/25070521204-CA-03.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 16. Limitations & Future Scope

1. **Local MongoDB Dependency:** Real database CRUD operations require a running local MongoDB instance or a remote Atlas connection string configured in `server/.env`.
2. **Simulated Payment Gateway:** A commercial deployment would integrate an external PCI-compliant payment gateway (e.g. Razorpay or Stripe) using webhooks.
3. **Transactional Replica Sets:** For enterprise-scale concurrency, multi-document ACID transactions can be activated with a MongoDB replica set (`rs0`).
