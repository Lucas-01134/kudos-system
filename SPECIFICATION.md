# Kudos Application — Specification

## 1. Overview

The Kudos Application is a full-stack web platform that enables teams to recognize and celebrate each other's achievements. Users can send praise ("kudos") to colleagues, browse a shared feed, manage profiles, and engage through likes. Administrators can moderate content by hiding or deleting inappropriate kudos.

This document captures the approved requirements and design for the completed implementation.

---

## 2. Requirements

### 2.1 Functional Requirements

#### Authentication & User Management
- Users must be able to **register** with username, email, password, and optional first/last name.
- Users must be able to **log in** using either email or username plus password.
- Authentication uses **JWT tokens** (7-day expiry) stored in browser localStorage.
- Authenticated users can **view and update** their profile (first name, last name, bio, profile image).
- The system must expose a **list of all users** for recipient selection when sending kudos.

#### Kudos Core Features
- Authenticated users can **send kudos** to other users with:
  - A message (1–500 characters, required)
  - A category: leadership, teamwork, innovation, support, excellence, or other
  - A privacy setting: public or private
- Users **cannot send kudos to themselves**.
- Recipients can be resolved by **user ID, username, or email**.
- Users can view **received kudos** and **sent kudos** on their profile (paginated).
- Users can browse a **public kudos feed** with pagination.
- Users can **like/unlike** kudos (toggle).
- Senders can **delete their own kudos**.

#### Privacy
- **Public kudos** appear in the organization-wide feed.
- **Private kudos** are visible only to the sender and recipient in the feed; they display a private marker in the UI.
- Anonymous/unauthenticated visitors see only public, visible kudos in the feed.

#### Moderation & Administration
- The system supports a single **administrator role** (`isAdmin` on User).
- The **first admin** is bootstrapped by a user promoting themselves when no admin exists.
- Only existing admins can grant or revoke admin status for other users.
- Admins can **hide kudos** from all views by setting `isVisible` to false (soft moderation).
- Admins can **delete any kudos**; regular users can delete only their own.
- Hidden kudos (`isVisible: false`) are excluded from feed, received, and sent queries.

#### Statistics
- Each user has viewable stats: total kudos received, total sent, and total likes on received kudos.

### 2.2 Non-Functional Requirements
- **Backend**: Node.js with Express.js, REST API, MongoDB persistence.
- **Frontend**: React 18 with Vite, Tailwind CSS, React Router, Axios.
- **Security**: Passwords hashed with bcryptjs; protected routes require valid JWT.
- **CORS**: Enabled for frontend-backend communication.
- **Development**: Frontend proxies `/api` to backend on port 5000; frontend dev server on port 5173.

---

## 3. Design

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│  Pages: Home, Login, Register, Feed, Send, Profile      │
│  Context: AuthContext (JWT in localStorage)             │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP /api (Axios + JWT header)
┌────────────────────────▼────────────────────────────────┐
│                 Express.js Backend (port 5000)           │
│  Routes: /api/auth/*, /api/kudos/*                       │
│  Middleware: auth, optional, admin                       │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────────┐
│                      MongoDB                             │
│  Collections: users, kudos                               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Data Models

#### User
| Field         | Type    | Notes                          |
|---------------|---------|--------------------------------|
| username      | String  | Unique, min 3 chars            |
| email         | String  | Unique, validated              |
| password      | String  | Hashed, min 6 chars            |
| firstName     | String  | Optional                       |
| lastName      | String  | Optional                       |
| profileImage  | String  | URL, optional                  |
| bio           | String  | Optional                       |
| isAdmin       | Boolean | Default false                  |
| createdAt     | Date    | Auto                           |
| updatedAt     | Date    | Auto                           |

#### Kudos
| Field      | Type       | Notes                                              |
|------------|------------|----------------------------------------------------|
| from       | ObjectId   | Ref User, required                                 |
| to         | ObjectId   | Ref User, required                                 |
| message    | String     | 1–500 chars, required                              |
| category   | String     | Enum: leadership, teamwork, innovation, support, excellence, other |
| isPublic   | Boolean    | Default true                                       |
| isVisible  | Boolean    | Default true; false = admin-hidden                 |
| likes      | ObjectId[] | Ref User                                           |
| createdAt  | Date       | Auto                                               |
| updatedAt  | Date       | Auto                                               |

**Indexes**: `{ to, createdAt }`, `{ from, createdAt }` (descending sort).

### 3.3 API Design

#### Authentication (`/api/auth`)
| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| POST   | `/register`           | Public   | Create account                 |
| POST   | `/login`              | Public   | Login (identifier + password)  |
| GET    | `/profile`            | Required | Get current user               |
| PUT    | `/profile`            | Required | Update profile                 |
| GET    | `/users`              | Public   | List all users                 |
| GET    | `/users/:id`          | Public   | Get user by ID                 |
| PATCH  | `/users/:id/admin`    | Required | Set admin status               |

#### Kudos (`/api/kudos`)
| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| POST   | `/send`               | Required | Send kudos                     |
| GET    | `/received`           | Required | Paginated received kudos       |
| GET    | `/sent`               | Required | Paginated sent kudos           |
| GET    | `/feed`               | Optional | Paginated feed                 |
| POST   | `/:id/like`           | Required | Toggle like                    |
| PATCH  | `/:id/visibility`     | Admin    | Hide/show kudos                |
| DELETE | `/:id`                | Required | Delete (owner or admin)        |
| GET    | `/stats/:id`          | Public   | User kudos statistics          |

#### Feed Query Logic
- **Unauthenticated**: `isVisible !== false AND isPublic === true`
- **Authenticated**: `isVisible !== false AND (isPublic OR from/to is current user)`

### 3.4 Middleware

| Middleware | Purpose                                              |
|------------|------------------------------------------------------|
| `auth`     | Validates JWT; sets `req.userId`                     |
| `optional` | Parses JWT if present; continues if absent/invalid   |
| `admin`    | Requires authenticated user with `isAdmin: true`      |

### 3.5 Frontend Design

#### Routes
| Path          | Component      | Access        |
|---------------|----------------|---------------|
| `/`           | HomePage       | Public        |
| `/login`      | LoginPage      | Public        |
| `/register`   | RegisterPage   | Public        |
| `/feed`       | FeedPage       | Authenticated |
| `/send-kudos` | SendKudosPage  | Authenticated |
| `/profile`    | ProfilePage    | Authenticated |

#### Key Components
- **Navbar** — Navigation and auth state (login/logout links).
- **KudosCard** — Displays kudos with category emoji, public/private badge, like button, and delete (sender only).
- **LoadingSpinner** — Shared loading state.
- **AuthContext** — Manages user session, login, register, logout, profile update.

#### Send Kudos UX
- Dropdown populated with all users except the current user.
- Fallback text input for recipient ID/username/email when no other users exist.
- Category selector and public/private checkbox with explanatory copy.

#### Profile UX
- Avatar initial, name, username, bio.
- Inline edit mode for profile fields.
- Stats panel: received, sent, likes.
- Recent received and sent kudos lists.

### 3.6 Admin Bootstrap Flow

1. Register and log in as the first user.
2. Call `PATCH /api/auth/users/:ownId/admin` with `{ "isAdmin": true }`.
3. Subsequent admin promotions require an existing admin's token.

### 3.7 Environment Configuration

**Backend (`.env`)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kudos
JWT_SECRET=<secret>
NODE_ENV=development
```

---

## 4. Out of Scope (Future Enhancements)

- Real-time notifications (Socket.io)
- Email notifications
- Advanced search and filtering
- User following/subscriptions
- Trending kudos and leaderboards
- Slack/Teams integration
- Kudos templates
- Dedicated admin UI panel (moderation is API-driven)

---

## 5. Acceptance Criteria (Completed)

- [x] User registration and login with JWT
- [x] Send kudos with message, category, and privacy control
- [x] View paginated feed, received, and sent kudos
- [x] Like/unlike kudos
- [x] Profile viewing, editing, and statistics
- [x] Prevent self-kudos
- [x] Private kudos visible only to sender and recipient
- [x] Admin role with bootstrap and promotion rules
- [x] Admin hide (visibility) and delete moderation
- [x] Login with email or username
- [x] Recipient lookup by ID, username, or email

---

## 6. Tech Stack Summary

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend  | Node.js, Express.js, Mongoose                 |
| Database | MongoDB                                         |
| Auth     | JWT (jsonwebtoken), bcryptjs                    |

---

*Document version: 1.0 — reflects the approved and implemented Kudos Application feature set.*
