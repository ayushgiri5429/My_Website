# BarberShop — Full-Stack Web Application

A production-ready barber shop web application with a **vanilla HTML/CSS/JS frontend** and a **Node.js + Express backend** featuring authentication, appointment booking, loyalty rewards, offers, and membership enrollment.

---

## Table of Contents

- [Folder Structure](#folder-structure)
- [Folder Explanations](#folder-explanations)
- [Terminal Commands to Generate the Structure](#terminal-commands-to-generate-the-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Best Practices for Scalable Apps](#best-practices-for-scalable-apps)

---

## Folder Structure

```
barber-shop/
├── frontend/                    # Client-side application
│   ├── index.html               # Main HTML entry point
│   ├── css/
│   │   ├── main.css             # Global styles, layout, responsive
│   │   ├── auth.css             # Auth modal & form styles
│   │   ├── booking.css          # Booking form & list styles
│   │   └── loyalty.css          # Loyalty dashboard & tier styles
│   ├── js/
│   │   ├── app.js               # App initialization & shared UI
│   │   ├── api.js               # Centralized HTTP client (fetch wrapper)
│   │   ├── auth.js              # Login, register, session management
│   │   ├── booking.js           # Booking form & appointment logic
│   │   └── loyalty.js           # Loyalty points & tier display
│   ├── pages/                   # Additional HTML pages (if needed)
│   └── assets/
│       └── images/              # Static images & icons
│
├── backend/                     # Server-side application
│   ├── server.js                # Express app entry point
│   ├── package.json             # Dependencies & scripts
│   ├── .env.example             # Environment variable template
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js              # JWT authentication & role authorization
│   ├── models/
│   │   ├── User.js              # User schema (customer/barber/admin)
│   │   ├── Booking.js           # Appointment schema
│   │   ├── Loyalty.js           # Points & tier tracking schema
│   │   ├── Offer.js             # Promotional offer schema
│   │   └── Enrollment.js        # Membership plan schema
│   ├── controllers/
│   │   ├── authController.js    # Auth business logic
│   │   ├── bookingController.js # Booking CRUD logic
│   │   ├── loyaltyController.js # Points management logic
│   │   ├── offerController.js   # Offer CRUD logic
│   │   └── enrollmentController.js  # Enrollment logic
│   ├── routes/
│   │   ├── auth.js              # /api/auth routes
│   │   ├── bookings.js          # /api/bookings routes
│   │   ├── loyalty.js           # /api/loyalty routes
│   │   ├── offers.js            # /api/offers routes
│   │   └── enrollment.js        # /api/enrollment routes
│   └── utils/
│       └── helpers.js           # Shared utility functions
│
└── README.md                    # This file
```

---

## Folder Explanations

### Frontend

| Folder/File | Purpose |
|---|---|
| `frontend/` | Contains all client-side code. Served as static files or via a simple HTTP server. |
| `css/` | Modular stylesheets split by feature (auth, booking, loyalty) for maintainability. |
| `js/` | JavaScript modules following the **Module Pattern** (IIFE/revealing module) for encapsulation. |
| `js/api.js` | Single source of truth for all HTTP requests. Handles token injection, error parsing, and base URL config. |
| `js/auth.js` | Manages login/register forms, JWT storage in `localStorage`, and auth state propagation. |
| `js/booking.js` | Appointment form validation, submission, and booking list rendering. |
| `js/loyalty.js` | Fetches and displays loyalty points, tier badges, and points history. |
| `js/app.js` | Bootstraps the app on `DOMContentLoaded`, loads services/offers, sets up navigation. |
| `pages/` | Placeholder for additional pages (e.g., profile, admin dashboard) as the app grows. |
| `assets/images/` | Static assets like logos, barber photos, service icons. |

### Backend

| Folder/File | Purpose |
|---|---|
| `backend/` | Node.js + Express REST API server. |
| `server.js` | App entry point — wires up middleware, routes, DB connection, error handling. |
| `config/db.js` | Database connection logic (MongoDB via Mongoose). Isolated for easy swapping. |
| `middleware/auth.js` | JWT verification middleware + role-based authorization (`authenticate`, `authorizeRoles`). |
| `models/` | Mongoose schemas defining data structure, validation, indexing, and instance methods. |
| `controllers/` | Business logic handlers. Each controller maps to a model/feature and is called by routes. |
| `routes/` | Express routers defining API endpoints, request validation (express-validator), and middleware chains. |
| `utils/helpers.js` | Shared utilities (response formatting, pagination parsing, code generation). |
| `.env.example` | Template for required environment variables. Copy to `.env` and fill in values. |

---

## Terminal Commands to Generate the Structure

Run these commands from the project root to create the entire folder structure from scratch:

```bash
# ----- Create all directories -----
mkdir -p barber-shop/frontend/{css,js,pages,assets/images}
mkdir -p barber-shop/backend/{config,middleware,models,routes,controllers,utils}

# ----- Create frontend files -----
touch barber-shop/frontend/index.html
touch barber-shop/frontend/css/{main.css,auth.css,booking.css,loyalty.css}
touch barber-shop/frontend/js/{app.js,api.js,auth.js,booking.js,loyalty.js}

# ----- Create backend files -----
touch barber-shop/backend/{server.js,package.json,.env.example}
touch barber-shop/backend/config/db.js
touch barber-shop/backend/middleware/auth.js
touch barber-shop/backend/models/{User.js,Booking.js,Loyalty.js,Offer.js,Enrollment.js}
touch barber-shop/backend/controllers/{authController.js,bookingController.js,loyaltyController.js,offerController.js,enrollmentController.js}
touch barber-shop/backend/routes/{auth.js,bookings.js,loyalty.js,offers.js,enrollment.js}
touch barber-shop/backend/utils/helpers.js

# ----- Create documentation -----
touch barber-shop/README.md

# ----- Verify structure -----
find barber-shop -type f | sort
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local or cloud — [MongoDB Atlas](https://www.mongodb.com/atlas) for free tier)
- **npm** or **yarn**

### Backend Setup

```bash
cd barber-shop/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### Frontend Setup

```bash
cd barber-shop/frontend

# Option 1: Simple HTTP server (Python)
python3 -m http.server 3000

# Option 2: Using VS Code Live Server extension

# Option 3: Using npx
npx serve -l 3000
```

Open `http://localhost:3000` in your browser.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login & receive JWT |
| GET | `/api/auth/profile` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| POST | `/api/bookings` | Yes | Create a booking |
| GET | `/api/bookings` | Yes | Get user's bookings |
| GET | `/api/bookings/:id` | Yes | Get booking details |
| PATCH | `/api/bookings/:id/status` | Barber/Admin | Update booking status |
| PATCH | `/api/bookings/:id/cancel` | Yes | Cancel a booking |
| GET | `/api/loyalty/me` | Yes | Get loyalty data |
| POST | `/api/loyalty/add` | Barber/Admin | Award loyalty points |
| POST | `/api/loyalty/redeem` | Yes | Redeem points |
| GET | `/api/loyalty/leaderboard` | No | Top 10 loyalty members |
| GET | `/api/offers` | No | List active offers |
| POST | `/api/offers` | Admin | Create an offer |
| PUT | `/api/offers/:id` | Admin | Update an offer |
| DELETE | `/api/offers/:id` | Admin | Delete an offer |
| POST | `/api/offers/validate` | No | Validate offer code |
| POST | `/api/enrollment` | Yes | Enroll in a plan |
| GET | `/api/enrollment/me` | Yes | Get active enrollment |
| GET | `/api/enrollment/history` | Yes | Enrollment history |
| PATCH | `/api/enrollment/:id/cancel` | Yes | Cancel enrollment |
| PATCH | `/api/enrollment/:id` | Yes | Update enrollment |

---

## Best Practices for Scalable Apps

### 1. Separation of Concerns (MVC Pattern)
- **Models** define data shape & validation
- **Controllers** contain business logic
- **Routes** map HTTP endpoints to controllers
- Never put business logic in routes or models

### 2. Modular File Organization
- Group files **by feature** (auth, booking, loyalty) rather than by type
- Each module should be self-contained with its own route, controller, and model
- This makes it easy to add/remove features independently

### 3. Environment Configuration
- Use `.env` for secrets — never commit real credentials
- Provide `.env.example` as a template for onboarding
- Use different configs for development, staging, and production

### 4. Security First
- **Helmet** for HTTP security headers
- **Rate limiting** to prevent abuse
- **JWT** with expiry for stateless authentication
- **bcrypt** for password hashing (salt rounds = 12)
- **Input validation** with express-validator on every route
- **CORS** configured to allow only trusted origins in production

### 5. Error Handling
- Centralized error handler in `server.js`
- Never expose stack traces in production
- Use consistent error response format: `{ error: "message" }`
- Validate all inputs before processing

### 6. Database Best Practices
- Add **indexes** on frequently queried fields (`customer`, `date`, `email`)
- Use Mongoose **schema validation** for data integrity
- Keep connection logic isolated in `config/db.js`

### 7. API Design
- Use **RESTful conventions** (nouns for resources, HTTP verbs for actions)
- Implement **pagination** for list endpoints
- Return appropriate **HTTP status codes** (201 for created, 409 for conflict, etc.)
- Version your API when it grows: `/api/v1/...`

### 8. Frontend Architecture
- **Module Pattern** for encapsulation — avoid polluting global scope
- **Single API layer** (`api.js`) for all HTTP calls
- **Event-driven** UI updates — auth state changes propagate to all modules
- **Progressive enhancement** — core features work without JS frameworks

### 9. Scalability Patterns
- Stateless server design → easy horizontal scaling
- Database indexing for query performance
- Rate limiting to protect against traffic spikes
- Modular architecture allows microservice extraction later

### 10. Developer Experience
- `nodemon` for auto-restart during development
- `eslint` for consistent code style
- Clear `package.json` scripts (`start`, `dev`, `lint`, `test`)
- Comprehensive README for quick onboarding
