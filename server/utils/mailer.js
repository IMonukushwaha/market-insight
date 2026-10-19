const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || 587);

    if (!host || !user || !pass || !Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASS, and a valid SMTP_PORT must be configured');
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host,
            port,
            secure: process.env.SMTP_SECURE === 'true' || port === 465,
            auth: { user, pass },
        });
    }

    return transporter;
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]);
}

async function sendVerificationEmail({ email, username, token }) {
    const clientOrigin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/+$/, '');
    const verificationUrl = new URL('/verify-email', `${clientOrigin}/`);
    verificationUrl.searchParams.set('token', token);

    const safeUsername = escapeHtml(username);
    const safeUrl = escapeHtml(verificationUrl.href);

    await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Verify your Market Insights email',
        text: `Hello ${username},\n\nVerify your email address by opening this link:\n${verificationUrl.href}\n\nThis link expires in 24 hours.`,
        html: `<p>Hello ${safeUsername},</p><p>Verify your email address by clicking the link below:</p><p><a href="${safeUrl}">Verify my email</a></p><p>This link expires in 24 hours.</p>`,
    });
}

module.exports = { sendVerificationEmail };
