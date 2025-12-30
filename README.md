# 🛒 Retail Store Application

Full-stack Retail Store web app with **React (Vite)** frontend and **Spring Boot** backend.  
Supports **JWT auth**, **USER/ADMIN roles**, **Cart → Checkout**, **Orders**, **Admin CRUD**, and **Razorpay payments**.

---

## 📸 Screenshots

### Auth
#### Login
![Login](./screenshots/login.png)

---

### Admin Pages
#### Admin Dashboard
![Home](./screenshots/Role_Admin/dashboard.png)

#### Explore
![Categories](./screenshots/Role_Admin/explore.png)

#### Manage Items (CRUD)
![Items](./screenshots/Role_Admin/manageItems.png)

#### Manage Categories
![Categories](./screenshots/Role_Admin/manageCategories.png)

#### Manage Users
![Users](./screenshots/Role_Admin/manageUsers.png)

#### Manage Inventory
![Inventory](./screenshots/Role_Admin/manageInventory.png)

#### Order History
![Order History](./screenshots/Role_Admin/orderHistory.png)

#### Update Inventory
![Update_Inventory](./screenshots/Role_Admin/updateInventory.png)

---

### User Pages
#### User Dashboard
![Home](./screenshots/Role_User/dashboard.png)

#### Explore
![Categories](./screenshots/Role_User/explore.png)

#### Order History
![Order History](./screenshots/Role_User/orderHistory.png)

---

## ✨ Key Features

### User
- JWT login/signup
- Browse items + categories
- Add to cart, update quantity, remove items
- Place orders (Cash / Online payment)
- View order history
- Latest order view

### Admin
- Admin dashboard (today sales, today orders, recent orders with pagination)
- Category CRUD
- Item CRUD (under admin routes)
- Role-based access (USER / ADMIN)

### Payments
- Razorpay **order creation**
- Razorpay **signature verification**
- Payment status tracking (**PENDING / COMPLETED**)

---

## 🧱 Tech Stack

**Frontend**
- React (Vite)
- Axios
- Context API (cart/items state)
- React Router
- Bootstrap / custom CSS (as used in your UI)

**Backend**
- Spring Boot (REST APIs)
- Spring Security + JWT
- JPA/Hibernate
- MySQL
- Razorpay integration

---

## 🏗️ Architecture (High Level)

- React app calls Spring Boot APIs using Axios
- JWT stored in `localStorage` and sent as `Authorization: Bearer <token>`
- Spring Security protects routes
- Admin endpoints under `/admin/**`
- Orders + OrderItems persisted in MySQL
- PaymentDetails tracks payment flow
    - Cash orders: `COMPLETED`
    - Online orders: start as `PENDING`, become `COMPLETED` after verification

---