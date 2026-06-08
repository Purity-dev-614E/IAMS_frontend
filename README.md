# IAMS Frontend

Frontend application for the Internship Attachment Management System (IAMS). The app supports student attachment registration, eligibility review, daily logs, weekly reviews, supervisor feedback, admin oversight, reporting, and role-based dashboards.

## Overview

IAMS is a React single-page application built with Vite. It communicates with the IAMS backend through a centralized API client and feature-specific service modules. The interface is organized around the main user roles in the attachment workflow:

- Students register for attachment eligibility, manage attachments, create daily logs, review weekly progress, and submit final reports.
- University supervisors monitor assigned students and review student activity.
- Administrators manage users, students, attachments, eligibility reviews, supervisor approvals, dashboards, and reports.
- Industry supervisors access token-based review pages to provide external feedback.

## Tech Stack

- React 19
- Vite 8
- React Router DOM 6
- Framer Motion
- Lucide React and React Icons
- Vitest
- React Testing Library
- ESLint
- CSS Modules

## Requirements

- Node.js 20 or newer is recommended.
- npm, included with Node.js.
- A running IAMS backend API.

## Getting Started

Install dependencies:

```bash
npm install
```

Create or update `.env` in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

For production builds, point the variable to the production API:

```env
VITE_API_URL=https://iamsbackend-production.up.railway.app/api
```

Start the development server:

```bash
npm run dev
```

The app will be served by Vite, usually at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

```bash
npm run build
```

Creates a production build in `dist`.

```bash
npm run preview
```

Serves the production build locally for verification.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm test
```

Runs the Vitest test suite.

## Project Structure

```text
src/
  admin/                     Admin dashboards, users, students, reports, approvals
  apis/                      API client and API route constants
  assets/                    Static images used by the application
  contexts/                  React context providers, including authentication
  models/                    Frontend model classes and data transformers
  shared/                    Shared screens, widgets, services, and components
  student/                   Student dashboards, attachments, logs, reviews, reports
  theme/                     CSS variables and theme exports
  transitions/               Page transition components
  unisup/                    University supervisor dashboards and review flows
  test/                      Test setup files
```

The codebase uses feature folders. Screens, widgets, services, and styles live close to the feature that owns them. Most component styles use CSS Modules with filenames ending in `.module.css`.

## Routing

Routes are defined in `src/App.jsx` using `react-router-dom`.

### Public Routes

| Path | Screen |
| --- | --- |
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/review/:token` | Industry supervisor token-based review |

### Shared Routes

| Path | Screen |
| --- | --- |
| `/profile` | Shared profile management |

### Student Routes

| Path | Screen |
| --- | --- |
| `/dashboard` | Student dashboard |
| `/attachments` | Student attachments |
| `/logs` | Daily logs |
| `/logs/new` | Create daily log |
| `/logs/edit/:id` | Edit daily log |
| `/reviews` | Weekly reviews |
| `/reports` | Final attachment report |

### Admin Routes

| Path | Screen |
| --- | --- |
| `/admin` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/students` | Student management |
| `/admin/attachments` | Attachment oversight |
| `/admin/eligibility-reviews` | Attachment eligibility reviews |
| `/admin/supervisors/pending` | Pending supervisor approvals |
| `/admin/reports` | Reports |

### University Supervisor Routes

| Path | Screen |
| --- | --- |
| `/supervisor` | University supervisor dashboard |
| `/supervisor/students` | Assigned students |
| `/supervisor/students/:id/reviews` | Student review details |

Unknown routes redirect to `/`.

## API Client and Services

The frontend API layer is centered in `src/apis`.

```text
src/apis/
  index.js       API base URL, token storage, request wrapper, apiClient methods
  apiRoutes.js   Central route constants and URL helpers
```

`src/apis/index.js` exports:

- `tokenStorage` for session-based access and refresh token management.
- `apiClient.get(endpoint)`.
- `apiClient.post(endpoint, body)`.
- `apiClient.put(endpoint, body)`.
- `apiClient.delete(endpoint)`.
- `apiClient.logout()`.

The request wrapper attaches the bearer token when available:

```js
headers: {
  "Content-Type": "application/json",
  ...(authToken && { "Authorization": `Bearer ${authToken}` }),
  ...(options.headers || {}),
}
```

Feature services import `apiClient` and `API_ROUTES`, then expose domain-specific methods. For example:

```js
const data = await apiClient.get(
  `${API_ROUTES.dailyLogs.myLogs}?page=${page}&limit=${limit}`
);
```

This keeps network logic out of React components and centralizes endpoint changes.

## Authentication Flow

Authentication state is managed in `src/contexts/AuthContext.jsx`.

- Login calls `apiClient.post(API_ROUTES.auth.login, credentials)`.
- Access and refresh tokens are stored in `sessionStorage`.
- The authenticated user is stored under `iams_user`.
- `useAuth()` exposes `login`, `register`, `logout`, `updateUser`, `isAuthenticated`, and `hasRole`.
- `apiClient.logout()` calls the backend logout endpoint, clears tokens, and redirects to `/login`.

## Data Models and Transformation

The `src/models` folder contains frontend model classes and transformation helpers. Services use these helpers to convert backend API payloads into frontend-friendly models and to validate or transform data before submission.

Common helpers include:

- `transformToModel`
- `transformToAPI`
- `validateModel`
- `transformError`

Example service flow:

```js
const dailyLog = new DailyLog(logData);
const validation = validateModel(dailyLog);
const apiData = transformToAPI(dailyLog);
const data = await apiClient.post(API_ROUTES.dailyLogs.create, apiData);
```

## Main Feature Areas

### Student

- Attachment registration and eligibility request flow.
- Attachment status notices and review modal.
- Daily log creation, editing, submission, and listing.
- Weekly review summaries.
- Final attachment report submission.
- Student dashboard and profile management.

### Admin

- Admin dashboard overview.
- User management and account actions.
- Student management and supervisor assignment.
- Attachment oversight.
- Attachment eligibility review queue.
- Pending supervisor approvals.
- Reports and report generation.

### University Supervisor

- Supervisor dashboard.
- Assigned student listing.
- Student detail and review workflows.
- Review of daily logs and weekly review information.

### Industry Supervisor

- Token-based review route.
- Review of student logs.
- Feedback submission through public token links.

## Testing

Vitest is configured in `vite.config.js`:

```js
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  globals: true
}
```

Run tests with:

```bash
npm test
```

Test files follow the `*.test.jsx` convention. The current setup file is `src/test/setup.js`, which imports `@testing-library/jest-dom`.

## Styling

Most feature styles are colocated with components as CSS Modules:

```text
Component.jsx
Component.module.css
```

Global styles are defined in:

- `src/index.css`
- `src/App.css`
- `src/theme/variables.css`

Use CSS Modules for feature-level styling and shared theme variables for consistent colors, spacing, and typography.

## Environment Configuration

The app reads the API root from:

```env
VITE_API_URL=...
```

The value should include the `/api` segment because the main API client appends endpoint paths directly to this base URL.

Examples:

```env
VITE_API_URL=http://localhost:3000/api
```

```env
VITE_API_URL=https://iamsbackend-production.up.railway.app/api
```

Do not commit real secrets in `.env`. Vite only exposes variables prefixed with `VITE_` to the browser, so these values should be safe public configuration rather than credentials.

## Backend Integration Notes

The frontend expects the backend to expose endpoints matching `src/apis/apiRoutes.js`, including:

- Authentication: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`
- Users: `/users`
- Students: `/students`
- Attachments: `/attachments`
- Attachment eligibility: `/attachment-eligibility`
- Daily logs: `/daily-logs`
- Weekly reviews: `/weekly-reviews`
- Dashboards: `/dashboard`
- Reports: `/reports`
- End of attachment reports: `/end-of-attachment-reports`
- Industry review: `/industry/review/:token`

When backend routes change, update `src/apis/apiRoutes.js` first, then adjust any feature services if the response shape changed.

## Deployment

Build the app:

```bash
npm run build
```

The output is written to:

```text
dist/
```

For SPA hosting, configure the server to serve `index.html` for unknown paths so client-side routes work after refresh. The repository includes deployment-related files such as:

- `Dockerfile`
- `nginx.conf`
- `vercel.json`

## Development Workflow

1. Pull the latest changes.
2. Install dependencies with `npm install`.
3. Configure `VITE_API_URL`.
4. Run `npm run dev`.
5. Make changes inside the relevant feature folder.
6. Run `npm test` and `npm run lint` before committing.
7. Build with `npm run build` before deployment-sensitive changes.

## Troubleshooting

### API calls fail in development

Check that the backend is running and `.env` points to the correct API root:

```env
VITE_API_URL=http://localhost:3000/api
```

Restart the Vite dev server after changing `.env`.

### Refreshing a route returns 404

The host is not configured for SPA fallback. Configure the server to return `index.html` for unknown paths.

### Authentication redirects to login

The access token may be missing or expired. Clear browser session storage and log in again.

### Tests cannot find DOM matchers

Confirm `src/test/setup.js` imports:

```js
import '@testing-library/jest-dom';
```

## Repository Status Notes

This README documents the frontend only. Backend setup, database configuration, and production API deployment should be documented in the backend repository or the main project documentation.
