# 🍔 BoltEats — Food Ordering System

Full-stack food ordering app built with **React.js**, **Node.js (ES6 modules)**, **Express**, and **MongoDB**.  
UI design inspired by [Wolt](https://wolt.com).

---

## 🚀 Quick Start

### 1 — Backend

```bash
cd server
npm install
cp .env.example .env     # fill in your values
node seed.js             # seeds demo data + accounts
npm run dev              # starts on http://localhost:5000
```

### 2 — Frontend

```bash
cd client
npm install
npm start                # starts on http://localhost:3000
```

---

## ⚙️ Environment variables (`server/.env`)

| Key                    | Description                                      |
|------------------------|--------------------------------------------------|
| `MONGODB_URI`          | MongoDB connection string                        |
| `JWT_SECRET`           | Any long random string                           |
| `PAYHERE_MERCHANT_ID`  | From sandbox.payhere.lk dashboard                |
| `PAYHERE_SECRET`       | From sandbox.payhere.lk dashboard                |
| `PAYHERE_NOTIFY_URL`   | Your ngrok URL + `/api/payment/notify`           |
| `CLIENT_URL`           | `http://localhost:3000`                          |

---

## 💳 PayHere Sandbox

1. Register at **https://sandbox.payhere.lk**
2. Copy Merchant ID + Secret → `.env`
3. Expose backend with ngrok:
   ```bash
   npx ngrok http 5000
   # copy https://....ngrok.io → PAYHERE_NOTIFY_URL
   ```
4. Test card: `4916 2172 3454 1676` · any future expiry · any CVV

---

## 👤 Demo accounts (after `node seed.js`)

| Role     | Email                    | Password     |
|----------|--------------------------|--------------|
| Admin    | admin@foodapp.com        | admin123     |
| Customer | customer@foodapp.com     | customer123  |

---

## 🛠 Tech stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, React Router v6, Axios          |
| Styling   | Custom CSS — Wolt-inspired design system  |
| Backend   | Node.js (ES modules), Express 4           |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT (Bearer token), bcryptjs              |
| Payment   | PayHere Sandbox                           |
| Security  | Helmet, CORS, express-rate-limit          |

---

## 📡 API reference

| Method | Endpoint                    | Auth     | Description           |
|--------|-----------------------------|----------|-----------------------|
| POST   | /api/auth/register          | Public   | Register customer     |
| POST   | /api/auth/login             | Public   | Login                 |
| GET    | /api/auth/me                | User     | Current user          |
| GET    | /api/foods                  | Public   | List food items       |
| POST   | /api/foods                  | Admin    | Create food item      |
| PUT    | /api/foods/:id              | Admin    | Update food item      |
| DELETE | /api/foods/:id              | Admin    | Delete food item      |
| POST   | /api/orders                 | Customer | Place order           |
| GET    | /api/orders/my              | Customer | My orders             |
| GET    | /api/orders/admin/all       | Admin    | All orders            |
| PUT    | /api/orders/:id/status      | Admin    | Update order status   |
| POST   | /api/payment/initiate       | Customer | Start payment         |
| POST   | /api/payment/notify         | Public   | PayHere callback      |
| GET    | /api/payment/summary        | Admin    | Payment stats         |
| GET    | /api/admin/stats            | Admin    | Dashboard stats       |
| GET    | /api/admin/customers        | Admin    | All customers         |
