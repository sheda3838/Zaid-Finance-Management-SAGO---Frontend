# Personal Finance Management Application - Frontend

This is the frontend client for the Personal Finance Management Application. It provides a responsive, intuitive interface for managing personal finances, tracking income and expenses, viewing trends, and organizing financial activities efficiently.

## Technologies Used

- **React.js** (v19.2.8)
- **TypeScript** (v6.0.2)
- **Vite** (v8.2.2)
- **Tailwind CSS** (v4.3.3)
- **React Router** (v7.18.3)
- **Axios** (v1.20.0)
- **Lucide React** (v1.39.0)
- **Recharts** (v3.10.1)

## Prerequisites

- Node.js (v16+ recommended)
- npm
- The **Backend API** must be running to provide data and handle authentication.

## Installation

1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of the `frontend` directory to configure the application.

- `VITE_API_BASE_URL`: The base URL pointing to the backend API server. This is used by Axios to automatically route all API requests.

**Example `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend Connection

The frontend connects to the backend through a globally configured Axios instance. The base URL is dynamically injected using the `VITE_API_BASE_URL` environment variable. Additionally, the Axios interceptor automatically attaches the user's JWT Bearer token to all outbound requests and handles global `401 Unauthorized` responses by gracefully logging the user out.

## Running the Frontend

Start the development server with hot-module replacement (HMR):
```bash
npm run dev
```

Build the application for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Application Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Secure user registration, login, and automatic token management. |
| **Dashboard** | An overview of finances featuring total income, total expenses, and current balance. |
| **Time Periods** | Instantly filter dashboard metrics by "7 Days", "30 Days", or "All" time periods. |
| **Financial Trends** | An interactive trend chart visualizing income vs. expenses over the selected period. |
| **Transactions List** | A dedicated page and dashboard widget for browsing transaction history. |
| **Search & Filtering** | Search transactions by *description*, and filter by category or type (Income/Expense). |
| **Transaction Management** | Complete CRUD capabilities to create, view, edit, and delete transactions. |
| **Responsive UI** | A fully mobile-friendly design built with Tailwind CSS. |

## Application Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/login` | User Login | Public |
| `/register` | User Registration | Public |
| `/dashboard` | Main Dashboard & Trends | Protected |
| `/transactions` | Full Transaction History | Protected |

*(Unrecognized routes automatically redirect to `/login`)*

## Authentication Flow

Authentication is handled via a centralized React Context (`AuthContext`). 
1. Users register or log in via the public routes.
2. On successful authentication, the backend returns a user profile and a **JWT**, which are stored securely in `localStorage`.
3. The `ProtectedRoute` wrapper secures the `/dashboard` and `/transactions` routes. If a user attempts to access these without a valid token, they are redirected to `/login`.
4. The `logout` function clears the stored credentials and redirects the user safely back to the login screen.

## Validation & UX

The application is built with a strong emphasis on user experience:
- **Loading & Empty States:** Visual feedback is provided during network requests, and friendly empty states are shown when no transactions exist.
- **Form Validation:** All inputs strictly validate required fields, correct numeric amounts (> 0), and valid date ranges.
- **Old-Date Warnings:** Selecting a transaction date older than 365 days triggers a specialized warning/confirmation modal to prevent accidental data entry errors.
- **API Error Handling:** A centralized error parser converts raw Axios errors into human-readable UI alerts.
- **Delete Confirmation:** Users must explicitly confirm before a transaction is permanently deleted.

## Project Structure

```text
frontend/
├── package.json
├── index.html
├── vite.config.ts
└── src/
    ├── App.tsx                # Main application routing and configuration
    ├── components/            # Reusable UI components (Modals, Cards, Charts)
    ├── context/               # React Context providers (AuthContext)
    ├── pages/                 # Full page views (Login, Dashboard, Transactions)
    ├── services/              # API and backend communication (apiClient, transactionService)
    └── types/                 # TypeScript interfaces and type definitions
```

## Documentation

| Document | Link |
|----------|------|
| Requirement Analysis | [View Document](https://drive.google.com/file/d/1czd4oegahKemJ-k9XuJNfwquQYsogE9r/view?usp=sharing) |
| Functional Requirements | [View Document](https://drive.google.com/file/d/1ChIJqadF76e126xwj1uhUXvjQ0T-hB-b/view?usp=sharing) |
| Non Functional Requirements | [View Document](https://drive.google.com/file/d/1ChIJqadF76e126xwj1uhUXvjQ0T-hB-b/view?usp=sharing) |
| Problem Analysis | [View Document](https://drive.google.com/file/d/1lUPShsE2vqiRr4vmOwAsjqNBdkf5wCYz/view?usp=sharing) |
| API Documentation | [View Document](https://drive.google.com/file/d/1ChIJqadF76e126xwj1uhUXvjQ0T-hB-b/view?usp=sharing) |
| System Architecture | [View Diagram](https://drive.google.com/file/d/1UoyZrus6nmlRQK7pTEa7nDxhRS4DqGCL/view?usp=sharing) |
| Database Design | [View Diagram](https://drive.google.com/file/d/1nrAejrDzX1Bnmgr9yVf2DjQggGVsfWne/view?usp=sharing) |
