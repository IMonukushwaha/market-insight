const { createHash, randomBytes } = require('node:crypto');

function createEmailVerificationToken() {
    return randomBytes(32).toString('hex');
}

function hashEmailVerificationToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    createEmailVerificationToken,
    hashEmailVerificationToken,
};
