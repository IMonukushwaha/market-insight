const passport = require('passport');
const User = require('../models/users.js');
const AppError = require('../utils/ExpressError.js');

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    await new Promise((resolve, reject) => {
        req.login(registeredUser, (err) => {
            if (err) return reject(new AppError(500, 'Registered, but login failed'));
            resolve();
        });
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email
        }
    });
}

module.exports.login = async (req, res, next) => {
    const user = await new Promise((resolve, reject) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return reject(new AppError(500, "Something went wrong"));
            if (!user) return reject(new AppError(401, info?.message || "Invalid username or password"));
            resolve(user);
        })(req, res, next);
    });

    await new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
            if (err) return reject(new AppError(500, "Login failed"));
            resolve();
        });
    });

    res.status(200).json({
        message: "Logged in successfully",
        user: { id: user._id, username: user.username, email: user.email }
    });
}

module.exports.checkAuth = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            isAuthenticated: true,
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    }
    return res.status(200).json({ isAuthenticated: false });
}

module.exports.logout = async (req, res) => {
    await new Promise((resolve, reject) => {
        req.logout((err) => {
            if (err) return reject(new AppError(500, "Logout failed"));
            resolve();
        });
    });
    res.status(200).json({ message: "Logged out successfully" });
}