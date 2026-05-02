# Team Task Manager

Team Task Manager is a production-oriented MERN application for collaborative project and task management with JWT authentication and role-based access control.

## Stack

- Frontend: React, Vite, Tailwind CSS, Context API, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt password hashing, protected routes
- Roles: Admin and Member

## Features

- Signup and login with JWT stored in `localStorage`
- Admins can create, edit, and delete projects
- Admins can add/remove project members and assign tasks
- Members can view assigned projects and update only their task status
- Dashboard metrics for total, completed, pending, and overdue tasks
- Responsive dashboard UI with dark mode and toast notifications

## Local Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create backend environment file:

   ```bash
   cp backend/.env
   ```

3. Create frontend environment file:

   ```bash
   cp frontend/.env
   ```

4. Start the backend:

   ```bash
   npm run dev:backend
   ```

5. Start the frontend in another terminal:

   ```bash
   npm run dev:frontend
   ```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000/api`.

## API Overview

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users` admin only

Projects:

- `POST /api/projects` admin only
- `GET /api/projects`
- `PUT /api/projects/:id` admin only
- `DELETE /api/projects/:id` admin only

Tasks:

- `POST /api/tasks` admin only
- `GET /api/tasks`
- `GET /api/tasks/project/:projectId`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` admin only

## Railway Deployment

Deploy the backend and frontend as separate Railway services.

Backend service:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL`
  - `ALLOW_ROLE_SIGNUP`

Frontend service:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:
  - `VITE_API_URL=https://your-backend-domain.railway.app/api`

For public production use, set `ALLOW_ROLE_SIGNUP=false` after creating your first admin account or replace open role signup with an invitation flow.

## Vercel Deployment

Deploy the backend and frontend as two separate Vercel projects.

Backend project:

- Root directory: `backend`
- Framework preset: Other
- Build command: leave empty/default
- Output directory: leave empty
- Install command: `npm install`
- Environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL=https://your-frontend-domain.vercel.app`
  - `CLIENT_URLS=https://your-frontend-domain.vercel.app,https://your-preview-domain.vercel.app` optional comma-separated list
  - `ALLOW_ROLE_SIGNUP`

Frontend project:

- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://your-backend-domain.vercel.app/api`

After deploying the backend, open `https://your-backend-domain.vercel.app/api/health`. It should return JSON with `databaseConfigured: true` and `jwtConfigured: true`. If either value is `false`, add the missing variable in the Vercel project settings and redeploy.
