const User = require('../models/users.js');
const AppError = require('../utils/ExpressError.js');
const { hashPassword, verifyPassword } = require('../utils/passwords.js');
const {
    COOKIE_NAME,
    COOKIE_MAX_AGE,
    authCookieOptions,
    signAuthToken,
} = require('../utils/jwtAuth.js');

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
    };
}

function setAuthCookie(res, user) {
    const token = signAuthToken(user._id);
    res.cookie(COOKIE_NAME, token, {
        ...authCookieOptions,
        maxAge: COOKIE_MAX_AGE,
    });
}

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const credentials = await hashPassword(password);
    const user = await User.create({
        username,
        email,
        ...credentials,
    });

    setAuthCookie(res, user);
    res.status(201).json({
        message: 'Account created successfully.',
        user: publicUser(user),
    });
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
        .select('+hash +salt +passwordIterations');

    if (!user || !(await verifyPassword(password, user))) {
        throw new AppError(401, 'Invalid username or password');
    }

    setAuthCookie(res, user);
    res.status(200).json({
        message: 'Logged in successfully',
        user: publicUser(user),
    });
};

module.exports.checkAuth = (req, res) => {
    res.status(200).json({
        isAuthenticated: true,
        user: publicUser(req.user),
    });
};

module.exports.logout = async (req, res) => {
    res.clearCookie(COOKIE_NAME, authCookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
};
