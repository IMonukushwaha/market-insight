const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users.js');
const AppError = require("./utils/ExpressError.js");
const userRoutes = require('./routes/userroutes.js');
const chatRoutes = require('./routes/chatroutes.js');
require('dotenv').config();

const Mongo_url = 'mongodb://127.0.0.1:27017/Market_Insight';
const app = express();
let port = 5000;

const sessionOptions = {
    secret: process.env.Session_Secret,
    resave: true,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
    await mongoose.connect(Mongo_url);
}

main().then(() => console.log("Connected to my DB"))
    .catch(err => console.log("error", err));

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