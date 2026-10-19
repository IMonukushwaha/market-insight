# Market Insights

Market Insights is a full-stack web application for exploring public companies through AI-generated financial insights, market data, interactive charts, and chat history.

## Features

- Search for a public company and generate a financial insight report.
- View current market data and company information from Yahoo Finance.
- Explore stock, financial statement, ownership, institutional holder, and analyst recommendation charts.
- Save chat history for each account.
- Register and log in with JWT authentication stored in an HTTP-only cookie. A new account is logged in immediately after registration.

## Tech stack

- Frontend: React, Vite, React Router, React Bootstrap, and Recharts
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- External services: Groq API and Yahoo Finance

## Project structure

```text
Market_insight/
├── client/
│   ├── src/
│   │   ├── Components/
│   │   ├── Contexts/
│   │   ├── Style/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── chatdata/
    ├── controller/
    ├── models/
    ├── routes/
    ├── Services/
    ├── tools/
    ├── utils/
    ├── index.js
    └── package.json
```

## Local development

Use Node.js 24.14.1 and a MongoDB database. From the repository root, install and configure the backend:

```bash
cd server
npm ci
```

Create `server/.env` with the following values. Use either `MONGODB_URL` or `ATLASDB_URL` for the MongoDB connection string.

```env
MONGODB_URL=your_mongodb_connection_string
GROQ_AI_KEY=your_groq_api_key
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters_long
CLIENT_ORIGIN=http://localhost:5173
# YAHOO_PROXY_URL=your_proxy_url
```

Start the backend on `http://localhost:5000`:

```bash
npm start
```

In a second terminal, install and configure the frontend:

```bash
cd client
npm ci
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

For deployment, configure these environment variables in the hosting services. Set `CLIENT_ORIGIN` to the frontend's exact origin and `VITE_API_URL` to the backend's base URL.

## API overview

The Express server exposes these routes at its root URL (there is no `/api` prefix). Authenticated routes use the JWT cookie.

| Endpoint | Method | Description |
|---|---|---|
| `/signup` | POST | Create an account, set the auth cookie, and return the new user |
| `/login` | POST | Authenticate a user and set the auth cookie |
| `/check-auth` | GET | Return the current authenticated user |
| `/logout` | POST | Clear the auth cookie |
| `/prompt` | POST | Generate a company insight |
| `/chat/:chatId` | GET | Retrieve a chat |
| `/chat/:chatId` | DELETE | Delete a chat |
| `/chats` | GET | List recent chat titles for the current user |

