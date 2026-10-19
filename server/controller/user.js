const User = require('../models/users.js');
const AppError = require('../utils/ExpressError.js');
const { hashPassword, verifyPassword } = require('../utils/passwords.js');
const {
    createEmailVerificationToken,
    hashEmailVerificationToken,
} = require('../utils/emailVerificationToken.js');
const { sendVerificationEmail } = require('../utils/mailer.js');
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
    const token = createEmailVerificationToken();
    const registeredUser = await User.create({
        username,
        email,
        ...credentials,
        emailVerified: false,
        emailVerificationTokenHash: hashEmailVerificationToken(token),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
        console.log('Sending verification email to:', registeredUser.email);
        await sendVerificationEmail({ email: registeredUser.email, username, token });
    } catch (error) {
        console.error('Verification email delivery failed:', {
            message: error.message,
            code: error.code,
            responseCode: error.responseCode,
        });
        await User.deleteOne({ _id: registeredUser._id, emailVerified: false });
        throw new AppError(503, 'We could not send the verification email. Please check your email settings and try signing up again.');
    }

    res.status(201).json({
        message: 'Account created. Check your email for a verification link. The link expires in 24 hours.',
    });
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
        .select('+hash +salt +passwordIterations');

    if (!user || !(await verifyPassword(password, user))) {
        throw new AppError(401, 'Invalid username or password');
    }

    if (!user.emailVerified) {
        throw new AppError(403, 'Please verify your email before logging in.');
    }

    setAuthCookie(res, user);
    res.status(200).json({
        message: 'Logged in successfully',
        user: publicUser(user),
    });
};

module.exports.verifyEmail = async (req, res) => {
    const { token } = req.body;
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
        throw new AppError(400, 'This verification link is invalid or has expired.');
    }

    const user = await User.findOne({
        emailVerificationTokenHash: hashEmailVerificationToken(token),
        emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationTokenHash +emailVerificationExpires');

    if (!user) {
        throw new AppError(400, 'This verification link is invalid or has expired.');
    }

    if (!user.emailVerified) {
        await User.updateOne(
            { _id: user._id, emailVerified: false },
            { $set: { emailVerified: true } }
        );
    }

    res.status(200).json({ message: 'Your email has been verified. You can now log in.' });
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
