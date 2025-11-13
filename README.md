# Store Rating Web Application

This is a full-stack web application that allows users to view, rate, and review stores. It features role-based access control for Normal Users, Store Owners, and Administrators, each with a dedicated dashboard and functionalities.

## Features

### 👤 Normal User
- **Authentication**: Sign up and log in to the platform.
- **Password Management**: Update their password after logging in.
- **Store Discovery**: View a list of all registered stores with search and filter capabilities.
- **Ratings**: View overall store ratings and their own submitted ratings.
- **Submit/Edit Ratings**: Submit a rating (1-5 stars) for any store and modify it later.

### 🏪 Store Owner
- **Authentication**: Register their store and an owner account, and log in.
- **Password Management**: Update their password.
- **Dashboard**: View key metrics for their store, including average rating.
- **Customer Insights**: See a list of all users who have submitted ratings for their store.

### ⚙️ System Administrator
- **Full User Management**: Create, view, and manage all users (Admins, Owners, Users).
- **Full Store Management**: Create new stores and assign owners.
- **Global Dashboard**: View high-level statistics:
  - Total number of users
  - Total number of stores
  - Total number of ratings
- **Data Views**: View comprehensive lists of all users and stores with advanced filtering and sorting.

---

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Messaging**: KafkaJS (for potential future asynchronous tasks)
- **Environment**: `dotenv` for environment variable management

### Frontend
- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod for validation
- **API Communication**: Axios

---

## 📂 Project Structure

The project is a monorepo with two main folders: `backend` and `frontend`.

```
/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   └── utils/
    └── vite.config.ts
```

---

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL
- An instance of Kafka (optional, for full feature parity)

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory by copying `.env.example` (if provided) or creating it from scratch.

    ```properties
    # Server Port
    PORT=4000

    # PostgreSQL Connection URL
    DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

    # JWT Secret Key
    JWT_SECRET=your_super_strong_secret_key

    # Kafka Broker
    KAFKA_BROKER=localhost:9092

    # Set to 'development' to auto-reset DB on start
    NODE_ENV=development
    ```

4.  **Start the backend server:**
    The server will automatically create the necessary database tables if `NODE_ENV=development`.
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:4000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173` and will be proxied to the backend for API requests.

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)
- `POST /auth/signup`: Register a new normal user.
- `POST /auth/signup-owner`: Register a new store owner and their store.
- `POST /auth/login`: Log in any user.

### Users (`/users`)
- `PATCH /users/change-password`: (Protected) Change the logged-in user's password.

### Stores (`/stores`)
- `GET /stores`: Get a list of all stores (public).
- `GET /stores/:id`: Get detailed information for a single store.

### Ratings (`/ratings`)
- `POST /ratings`: (Protected) Submit or update a rating for a store.

### Store Owner (`/owner`)
- `GET /owner/dashboard`: (Protected, Owner only) Get dashboard data for the owner's store.

### Admin (`/admin`)
- `GET /admin/stats`: (Protected, Admin only) Get platform-wide statistics.
- `GET /admin/users`: (Protected, Admin only) Get a list of all users.
- `POST /admin/users`: (Protected, Admin only) Create a new user.
- `GET /admin/stores`: (Protected, Admin only) Get a list of all stores.
- `POST /admin/stores`: (Protected, Admin only) Create a new store.
