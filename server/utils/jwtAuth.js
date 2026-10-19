const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'access_token';
const TOKEN_LIFETIME = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const JWT_ISSUER = 'market-insight-api';
const JWT_AUDIENCE = 'market-insight-client';

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
};

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set to a value at least 32 characters long');
    }
    return secret;
}

function signAuthToken(userId) {
    return jwt.sign(
        { sub: userId.toString() },
        getJwtSecret(),
        { expiresIn: TOKEN_LIFETIME, issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
    );
}

function verifyAuthToken(token) {
    return jwt.verify(token, getJwtSecret(), {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
}

function getAuthToken(req) {
    const cookiePrefix = `${COOKIE_NAME}=`;
    const cookie = req.headers.cookie
        ?.split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(cookiePrefix));

    return cookie ? cookie.slice(cookiePrefix.length) : null;
}

module.exports = {
    COOKIE_NAME,
    COOKIE_MAX_AGE,
    authCookieOptions,
    signAuthToken,
    verifyAuthToken,
    getAuthToken,
};
