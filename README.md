# Vehicle Rental Backend API

**Live URL:**  
https://vehicle-rental-backend-jade.vercel.app/

---

## Overview

Vehicle Rental Backend API is a RESTful backend service for managing a vehicle rental system.  
It supports user authentication, role-based access control, vehicle inventory management, and booking operations for both Admin and Customer roles.

---

## Features

- User authentication using JWT (Signup & Signin)
- Role-based authorization (Admin & Customer)
- Vehicle management (Create, Read, Update, Delete)
- Booking management (Create, Cancel, Return)
- Automatic vehicle availability handling
- PostgreSQL database integration
- Modular and scalable code architecture
- Deployed on Vercel

---

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Vercel (Deployment)

---

## Setup & Usage Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/saifullahkabir/vehicle-rental-backend.git
cd vehicle-rental-backend
```
### 2. Install Dependencies
```bash
npm install
```
### 4. Build the Project
```bash
npm run build
```
### 5. Run the Server
```bash
npm run dev
```

## Usage Instructions

- #### Use Postman or any API client
- #### Authentication is required for protected routes
- #### Include JWT token in request headers:
- Authorization: Bearer <jwt_token>

- #### Follow API endpoints exactly as defined in the specification:
-- /api/v1/auth
-- /api/v1/users
-- /api/v1/vehicles
-- /api/v1/bookings
