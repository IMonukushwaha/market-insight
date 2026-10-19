const { promisify } = require('node:util');
const { pbkdf2, timingSafeEqual } = require('node:crypto');
const bcryptPromise = import('bcryptjs').then((module) => module.default ?? module);

const pbkdf2Async = promisify(pbkdf2);
const PASSWORD_DIGEST = 'sha256';
const BCRYPT_COST = 12;

// Existing accounts use one of these PBKDF2 formats and are upgraded on login.
const LEGACY_ITERATIONS = 25_000;
const LEGACY_KEY_LENGTH = 512;
const CURRENT_ITERATIONS = 600_000;
const CURRENT_KEY_LENGTH = 32;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

async function hashPassword(password) {
    const bcrypt = await bcryptPromise;
    if (bcrypt.truncates(password)) {
        throw new RangeError('Password cannot exceed 72 UTF-8 bytes');
    }

    // bcrypt stores the generated salt inside the encoded hash string.
    return { hash: await bcrypt.hash(password, BCRYPT_COST) };
}

async function verifyLegacyPassword(password, user) {
    const bcrypt = await bcryptPromise;
    const isOldPluginHash = user.passwordIterations == null;
    if (!isOldPluginHash && user.passwordIterations !== CURRENT_ITERATIONS) {
        return false;
    }

    const iterations = isOldPluginHash ? LEGACY_ITERATIONS : CURRENT_ITERATIONS;
    const keyLength = isOldPluginHash ? LEGACY_KEY_LENGTH : CURRENT_KEY_LENGTH;
    if (typeof user.salt !== 'string' || typeof user.hash !== 'string' ||
        !new RegExp(`^[a-f0-9]{${keyLength * 2}}$`, 'i').test(user.hash)) {
        return false;
    }

    const candidate = await pbkdf2Async(
        password,
        user.salt,
        iterations,
        keyLength,
        PASSWORD_DIGEST
    );
    const stored = Buffer.from(user.hash, 'hex');

    if (!timingSafeEqual(candidate, stored)) {
        return false;
    }

    // bcrypt truncates longer passwords, so keep those legacy hashes intact.
    if (!bcrypt.truncates(password)) {
        user.hash = await bcrypt.hash(password, BCRYPT_COST);
        user.salt = undefined;
        user.passwordIterations = undefined;
        await user.save();
    }

    return true;
}

async function verifyPassword(password, user) {
    const bcrypt = await bcryptPromise;
    if (typeof user.hash !== 'string') {
        return false;
    }

    if (BCRYPT_HASH_PATTERN.test(user.hash)) {
        if (bcrypt.truncates(password)) {
            return false;
        }
        return bcrypt.compare(password, user.hash);
    }

    return verifyLegacyPassword(password, user);
}

module.exports = { hashPassword, verifyPassword };
