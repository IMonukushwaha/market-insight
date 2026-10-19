const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hash: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    passwordIterations: { type: Number, select: false },
    // Keep accounts created before email verification enabled usable. New signups
    // explicitly set this to false in the signup controller.
    emailVerified: { type: Boolean, default: true },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
  }
);

module.exports = mongoose.model('User', userSchema);
