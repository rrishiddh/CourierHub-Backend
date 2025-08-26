# Somoy Express Courier - Backend(API)

A secure, modular and role-based backend API for parcel delivery system built with Express.js, TypeScript, and MongoDB Atlas.

* * *


## Project Overview
Somoy Express is a comprehensive parcel delivery management system designed to streamline the entire courier service workflow. Inspired by popular delivery platforms like Pathao Courier and Sundarban this API provides a robust foundation for building modern courier and logistics applications.
The system implements a three-tier role-based architecture where Senders can create and manage parcel delivery requests, Receivers can track incoming packages and confirm deliveries, and Admins oversee the entire operation with complete system control. Each parcel is assigned a unique tracking ID and follows a complete lifecycle from request to delivery with real-time status updates.
Built with security-first principles, the API features JWT-based authentication, bcrypt password hashing, and comprehensive input validation. The modular architecture ensures scalability and maintainability, while MongoDB's flexible document structure efficiently handles complex parcel data and embedded status logs.
Whether you're building a small-scale local delivery service or a large enterprise logistics platform, Somoy Express API provides the essential building blocks with production-ready features including automated fee calculation, delivery confirmation workflows, and comprehensive admin controls for user and parcel management.

###


## Features

* **JWT Authentication**: Secure user authentication with role-based access control
* **Role Management**: Three distinct roles - Admin, Sender, and Receiver with specific permissions
* **Parcel Management**: Complete CRUD operations for parcel creation, tracking, and delivery
* **Status Tracking**: Real-time parcel status updates with embedded status logs
* **Automatic Tracking ID**: Auto-generated unique tracking IDs for each parcel
* **Fee Calculation**: Dynamic fee calculation based on weight and parcel type
* **Delivery Confirmation**: Receiver-initiated delivery confirmation system
* **Admin Controls**: User management, parcel oversight, and status updates
* **Data Validation**: Comprehensive schema validation with Mongoose
* **Error Handling**: Proper error responses with detailed messages
* **TypeScript**: Full type safety and modern JavaScript features

## Installation & Setup Steps

- **Step 1**: Clone Project Directory.
 
```bash
git clone https://github.com/rrishiddh/Somoy-Express-API.git
```

- **Step 2**: Install Project Dependencies.

```bash
npm install
```

- **Step 3**: Setup Environment Variables.

Create a `.env` file in the root directory:

```env
PORT=5000(for localhost)
MONGODB_URI=YOUR_MONGODB_CONNECTION_URI
JWT_SECRET=your-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGINS=http://localhost:5000
```

- **Step 4**: Run the Application.

```bash
npm run dev
```

- **Step 5**: Test API - Use Postman to test endpoints.

###

## Project Structure

* `src/modules/auth/` ~ Authentication controllers and routes
* `src/modules/user/` ~ User management with role-based operations
* `src/modules/parcel/` ~ Parcel CRUD operations with status tracking
* `src/middlewares/` ~ Authentication, authorization, and error handling
* `src/config/` ~ Database configuration
* `src/utils/` ~ JWT utilities and fee calculation helpers
* `src/app.ts` ~ Express application setup

###

## API Endpoints

### Authentication
- **Register User** ~ `POST /api/auth/register`
- **Login User** ~ `POST /api/auth/login`

### User Management
- **Get User Profile** ~ `GET /api/users/profile`
- **Get All Users** (Admin) ~ `GET /api/users`
- **Toggle User Status** (Admin) ~ `PATCH /api/users/toggle-status/:userId`

### Parcel Management
- **Create Parcel** (Sender) ~ `POST /api/parcels`
- **Get Sender's Parcels** ~ `GET /api/parcels/my-sent`
- **Get Receiver's Parcels** ~ `GET /api/parcels/my-received`
- **Get Parcel by ID** ~ `GET /api/parcels/:id`
- **Track Parcel** ~ `GET /api/parcels/track/:trackingId`
- **Cancel Parcel** (Sender) ~ `PATCH /api/parcels/cancel/:id`
- **Confirm Delivery** (Receiver) ~ `PATCH /api/parcels/confirm-delivery/:id`

### Admin Operations
- **Get All Parcels** ~ `GET /api/parcels/admin/all`
- **Update Parcel Status** ~ `PATCH /api/parcels/admin/update-status/:id`

### Parcel Status Flow
1. `requested` → Created by sender
2. `approved` → Approved by admin
3. `dispatched` → Dispatched by admin
4. `in-transit` → Updated by admin
5. `delivered` → Confirmed by receiver
6. `cancelled` → Cancelled by sender (before dispatch)
7. `returned` → Returned parcel

### User Roles & Permissions

**Sender**:
- Create parcel delivery requests
- Cancel parcels (if not dispatched)
- View all their sent parcels and status logs

**Receiver**:
- View incoming parcels
- Confirm parcel delivery
- View delivery history

**Admin**:
- View and manage all users and parcels
- Block or unblock users
- Update delivery statuses
- Complete system oversight

### Dependencies:
- **express**: ^5.1.0
- **mongoose**: ^8.17.0
- **bcrypt**: ^6.0.0
- **jsonwebtoken**: ^9.0.2
- **cors**: ^2.8.5
- **dotenv**: ^17.2.1
- **express-validator**: ^7.0.1

### Dev Dependencies:
- **nodemon**: ^3.1.10
- **ts-node**: ^10.9.2
- **@types/node**: ^24.1.0
- **@types/express**: ^5.0.3
- **@types/bcrypt**: ^6.0.0
- **@types/cors**: ^2.8.19
- **@types/jsonwebtoken**: ^9.0.10
- **typescript**: ^5.8.3

   

## Links: 

### Live Demo (API): [https://somoy-express-api-rrishiddh.vercel.app/](https://somoy-express-api-rrishiddh.vercel.app/)

### Live Demo (Frontend): [https://somoy-express-rrishiddh.vercel.app/](https://somoy-express-rrishiddh.vercel.app/)

### GitHub-Repo-Frontend : [https://github.com/rrishiddh/Somoy-Express.git](https://github.com/rrishiddh/Somoy-Express.git)

