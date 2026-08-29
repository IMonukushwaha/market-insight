require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users.js');
const AppError = require("./utils/ExpressError.js");
const userRoutes = require('./routes/userroutes.js');
const chatRoutes = require('./routes/chatroutes.js');

const Mongo_url = process.env.ATLASDB_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();
let port = 5000;

app.set('trust proxy', 1);

async function main() {
    console.log("Connecting to database...");
    await mongoose.connect(Mongo_url);
}

main().then(() => console.log("Connected to my DB"))
    .catch(err => console.log("error", err));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '100kb' }));

// Sessions are now persisted in MongoDB (via connect-mongo) instead of the
// default in-memory store — so logins survive server restarts / nodemon
// reloads, and this scales past a single server instance.
const sessionOptions = {
    name: 'ctms.sid',
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 60 * 60 * 24 * 7, // 7 days, in seconds
    }),
    cookie: {
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
        secure: NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days, in ms
    },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.json({ message: "connected to server" });
});

app.use('/', userRoutes);   // /signup, /login, /logout, /check-auth
app.use('/', chatRoutes);   // /getprompt, /chat/:chatId, /chats

app.use((req, res, next) => {
    next(new AppError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ error: message });
});

app.listen(port, () => {
    console.log(`app is listening to ${port}`);
});