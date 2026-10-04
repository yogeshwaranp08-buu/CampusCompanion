# Campus Companion

**Your Digital Campus Hub** — A full-stack college web application for Thiagarajar College of Engineering (TCE).

## Features

- **Authentication** — JWT-based with HTTP-only cookies, bcrypt password hashing
- **Role-based Access** — Student and Admin roles with backend-enforced permissions
- **Announcements** — Admin CRUD, student read-only
- **Events** — Event management with date/time, venue, registration links
- **Notes** — File upload/download (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT)
- **Lost & Found** — Students can CRUD own posts, admin manages all
- **Resume Builder** — Configurable external link
- **Student Management** — Admin can view, search, filter, and manage student accounts
- **Profile** — Self-service profile editing
- **Responsive Design** — Desktop, tablet, and mobile support

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React.js, React Router, Axios |
| Styling    | Vanilla CSS (Design System)   |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB Atlas, Mongoose       |
| Auth       | JWT, bcryptjs, HTTP-only cookies |
| Uploads    | Multer                        |
| Security   | Helmet, CORS, Rate Limiting   |

## Folder Structure

```
campus-companion/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context provider
│   │   ├── layouts/        # App layout with sidebar
│   │   ├── pages/          # All page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main router
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Design system
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # DB configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, upload middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── seeds/              # Admin seed script
│   ├── uploads/            # File storage
│   └── server.js           # Server entry
├── .env.example
├── .gitignore
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the project root and fill in:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/campus-companion
JWT_SECRET=your_secure_secret
RESUME_BUILDER_URL=https://your-resume-builder.com
ADMIN_EMAIL=admin@tce.edu
ADMIN_PASSWORD=YourSecureAdminPassword
CLIENT_URL=http://localhost:5173
```

### 3. Seed Admin Account

```bash
cd server
npm run seed:admin
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## Authentication

| Account  | Email              | Registration     |
|----------|--------------------|------------------|
| Student  | *@student.tce.edu  | Self-registration |
| Admin    | admin@tce.edu      | Seed script only |

## API Overview

| Endpoint               | Methods                    | Auth      |
|------------------------|----------------------------|-----------|
| `/api/auth/register`   | POST                       | Public    |
| `/api/auth/login`      | POST                       | Public    |
| `/api/auth/logout`     | POST                       | Auth      |
| `/api/auth/me`         | GET                        | Auth      |
| `/api/announcements`   | GET, POST, PUT, DELETE     | Auth/Admin|
| `/api/events`          | GET, POST, PUT, DELETE     | Auth/Admin|
| `/api/notes`           | GET, POST, PUT, DELETE     | Auth/Admin|
| `/api/notes/:id/download` | GET                     | Auth      |
| `/api/lost-found`      | GET, POST, PUT, DELETE     | Auth      |
| `/api/users`           | GET, PUT, DELETE           | Admin     |
| `/api/users/stats/dashboard` | GET                  | Auth      |

## Role Permissions

| Feature        | Admin              | Student               |
|----------------|--------------------|-----------------------|
| Announcements  | Full CRUD          | Read only             |
| Events         | Full CRUD          | Read only             |
| Notes          | Full CRUD          | Read + Download       |
| Lost & Found   | Full CRUD          | CRUD own posts        |
| Students       | Full management    | No access             |
| Profile        | Own profile        | Own profile           |

## File Upload

- **Notes**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (max 25MB)
- **Images**: JPEG, PNG, GIF, WebP (max 5MB)
- Dangerous file types (exe, bat, etc.) are blocked
- Files stored in `server/uploads/` with subfolder organization

## Security

- Password hashing with bcryptjs (12 salt rounds)
- JWT tokens in HTTP-only cookies
- Helmet security headers
- CORS configuration
- Rate limiting on auth endpoints
- File type & MIME validation
- Backend role enforcement on all protected routes
- Ownership verification for Lost & Found
