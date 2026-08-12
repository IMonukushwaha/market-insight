# Market Insights
Market Insights is a full-stack web application that gives users instant, AI-generated financial insights on any public company.

# Features
 **Company Search** — Enter any company name to generate a market insight report
 
 **AI-Powered Chat** — Grok chatbot generates natural-language financial summaries
 
 **Real-Time Market Data** — Stock price, 52-week high/low and more via Yahoo Finance API
 
 **Financial Statements** — Balance sheet and income statement breakdowns (cash position, debt, revenue, net income, margins)
 
 **Institutional Holders** — View major shareholders for a company
 
 **Chat History** — Recent chats saved and accessible from the sidebar for each unique user.
 
 **User Authentication** — Login/logout with session-based user accounts

 # Tech Stack
 
 **Frontend**
- React
- Vite
  
**Backend**
- Node.js
- Express
  
**Database**
- MongoDB
  
**External Services**
- Grok API (AI chatbot / insight generation)
- Yahoo Finance API (real-time stock & financial data)

## Project Structure
```
Market_insight/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── Components/
│   │   ├── Contexts/
│   │   ├── Styles/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
└── server/                    # Express backend
    ├── chatdata/               # Chat/insight data handling
    ├── controller/             # Route logic (e.g. user controller)
    ├── models/                 # MongoDB schemas
    ├── node_modules/
    ├── routes/                 # API routes (userroutes.js, chatroutes.js, etc.)
    ├── Services/                # Grok & Yahoo Finance integrations
    ├── tools/
    ├── utils/                   # Helpers (wrapAsync.js, etc.)
    ├── .env
    ├── .gitignore
    ├── index.js                 # Server entry point
    ├── JoiSchema.js              # Validation schemas
    ├── middlewares.js            # validateUser, validatelogin, etc.
    ├── package-lock.json
    └── package.json
```

## 🔌 API Overview
```
| Endpoint | Method | Description |
|---|---|---|
| `/api/users/signup` | POST | Register a new user |
| `/api/users/login` | POST | Log in an existing user |
| `/api/users/check-auth` | GET | Check if user session is authenticated |
| `/api/users/logout` | POST | Log out the current user |
| `/api/chat/prompt` | POST | Send a prompt to generate a market insight (Grok) |
| `/api/chat/chat/:chatId` | GET | Retrieve a specific chat by ID |
| `/api/chat/chat/:chatId` | DELETE | Delete a specific chat by ID |
| `/api/chat/chats` | GET | Retrieve all recent chats titles for the logged-in user |
```
