# Inventory Management System

This workspace contains a full-stack MERN inventory management system with a soft-tone dashboard UI and an academic-style SPM/SRS report for the same project.

## Tech stack

- MongoDB
- Express
- React
- Node.js
- Vite

## Features

- Role-aware authentication with JWT
- Inventory dashboard with stock insights
- Product catalog with categories, suppliers, and storage locations
- Stock movement tracking for inbound, outbound, and adjustment entries
- Low-stock monitoring and recent activity feed
- Soft-tone responsive interface for desktop and mobile
- Project documentation in HTML and PDF-friendly format

## Project structure

- `backend` - Express API, MongoDB models, seed data
- `frontend` - React + Vite user interface
- `docs` - SPM/SRS report and print-ready assets

## Getting started

1. Create `backend/.env` from `backend/.env.example`.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Optional: seed the database with demo data:

   ```powershell
   npm run seed
   ```

4. Start the app in dual-server development mode:

   ```powershell
   npm run dev
   ```

5. Start the app in simple local demo mode:

   ```powershell
   npm run serve
   ```

## Default API and app URLs

- Frontend dev server: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Single-process local app: `http://localhost:5000`

## Seeded demo accounts

In demo mode or after running `npm run seed`, you can use:

- Admin: `admin@softstock.com` / `Admin@123`
- Staff: `staff@softstock.com` / `Staff@123`

## Runtime modes

- `DEMO_MODE=true`: runs a stable in-memory demo API so the project works locally without a separate MongoDB service.
- `DEMO_MODE=false`: uses the MongoDB + Mongoose backend routes.

## Render deployment

This project is ready for a single-service Render deployment.

Required environment variables on Render:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `DEMO_MODE=false`

Recommended Render settings:

- Service type: `Web Service`
- Build command: `npm install && npm run build`
- Start command: `npm run start --workspace backend`
- Health check path: `/api/health`

If you use the included `render.yaml`, Render can prefill most of this automatically.

## Report

The documentation package is available at:

- `docs/SPM_Report_Inventory_Management_System.html`
