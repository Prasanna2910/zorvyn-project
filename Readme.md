# 💰 Finance Dashboard Backend API

A robust backend system for managing financial records, user roles, and dashboard analytics. Built to demonstrate clean backend architecture, secure access control, and meaningful data aggregation.

---

## 🚀 Tech Stack

* **Node.js** – Backend runtime
* **Express.js** – API framework
* **Prisma ORM** – Database ORM
* **SQLite** – Lightweight database
* **JWT (JSON Web Tokens)** – Authentication
* **bcryptjs** – Password hashing

---

## 🎯 Features

### 🔐 Authentication & Authorization

* Secure login using JWT
* Password hashing with bcrypt
* Role-based access control (RBAC)

### 👥 User Roles

* **ADMIN**

  * Full access (CRUD + user management)
* **ANALYST**

  * Read access + dashboard insights
* **VIEWER**

  * Limited read-only access

---

### 💰 Financial Records Management

* Create, read, update, delete financial records
* Fields:

  * Amount
  * Type (INCOME / EXPENSE)
  * Category
  * Date
  * Notes
* Records linked securely to users

---

### 📊 Dashboard Analytics

#### 1. Summary

* Total Income
* Total Expense
* Net Balance

#### 2. Category-wise Breakdown

* Aggregated totals per category

#### 3. Monthly Trends

* Income & Expense grouped by month

#### 4. Recent Activity

* Latest financial records

---

### 🔍 Filtering & Pagination

#### Filtering:

* By type (INCOME / EXPENSE)
* By category
* By date range

#### Pagination:

* Page-based data retrieval
* Optimized for large datasets

---

## 📡 API Endpoints

### 🔐 Auth & Users

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| POST   | /users       | Create user   |
| POST   | /users/login | Login user    |
| GET    | /users       | Get all users |

---

### 💰 Records

| Method | Endpoint     | Description                |
| ------ | ------------ | -------------------------- |
| POST   | /records     | Create record (ADMIN)      |
| GET    | /records     | Get all records            |
| GET    | /records/my  | Get logged-in user records |
| PATCH  | /records/:id | Update record (ADMIN)      |
| DELETE | /records/:id | Delete record (ADMIN)      |

---

### 📊 Dashboard

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| GET    | /dashboard/summary       | Income/Expense summary |
| GET    | /dashboard/category-wise | Category aggregation   |
| GET    | /dashboard/monthly       | Monthly trends         |
| GET    | /dashboard/recent        | Recent records         |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
```

### 4. Run database migration

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
npm run dev
```

---

## 🧠 Design Decisions

### 1. JWT-based Authentication

Used JWT for stateless authentication, enabling scalable and secure user sessions.

---

### 2. Role-Based Access Control (RBAC)

Access is enforced at the middleware level to ensure:

* Secure endpoint protection
* Clean separation of concerns

---

### 3. User Identity from Token

User identity (`userId`) is extracted from JWT instead of client input.

👉 Prevents tampering and ensures data security.

---

### 4. Backend Aggregation

All dashboard calculations are handled in the backend:

* Improves performance
* Ensures consistency
* Reduces frontend complexity

---

### 5. Prisma ORM Usage

* Simplifies database operations
* Ensures type safety and readability
* Supports aggregation queries

---

## 📌 Assumptions

* Authentication is handled using JWT (no session-based auth)
* SQLite is used for simplicity (can be replaced with PostgreSQL)
* Basic validation implemented for inputs

---

## 🔮 Future Improvements

* API documentation (Swagger)
* Unit and integration testing
* Rate limiting
* Soft delete functionality
* Deployment (Docker / Cloud)

---

## 👨‍💻 Author

**Prasanna Venketesh**

---

## ⭐ Final Note

This project focuses on demonstrating:

* Clean backend architecture
* Secure API design
* Real-world data handling and aggregation

It is not just about functionality, but about **how the system is designed and structured**.
