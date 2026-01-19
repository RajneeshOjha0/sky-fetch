const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Use Google SMTP if SMTP_DETAILS is present
        // console.log(process.env.SMTP_DETAILS, "details");
        // console.log(process.env.SMTP_USER, "user");
        if (process.env.SMTP_DETAILS) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER, // Ensure this is set in your .env
                    pass: process.env.SMTP_DETAILS
                }
            });

        } else {
            // Fallback to Ethereal for development
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.ethereal.email',
                port: process.env.SMTP_PORT || 587,
                auth: {
                    user: process.env.SMTP_USER || 'ethereal_user',
                    pass: process.env.SMTP_PASS || 'ethereal_pass'
                }
            });
        }
    }

    async sendEmail(to, subject, text, html) {
        try {
            const info = await this.transporter.sendMail({
                from: '"SkyFetch" <noreply@skyfetch.io>',
                to,
                subject,
                text,
                html
            });

            console.log('Message sent: %s', info.messageId);
            // Preview only available when using Ethereal account
            if (!process.env.SMTP_HOST) {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sendOTP(to, otp) {
        const subject = 'Your SkyFetch Verification Code';
        const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to SkyFetch!</h2>
                <p>Please use the following code to verify your email address:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;
        await this.sendEmail(to, subject, text, html);
    }

    async sendPasswordReset(to, otp) {
        const subject = 'Reset Your Password - SkyFetch';
        const text = `Your password reset code is: ${otp}. It expires in 10 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Reset Your Password</h2>
                <p>You requested a password reset. Use the code below:</p>
                <h1 style="color: #FF5722; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;
        await this.sendEmail(to, subject, text, html);
    }

    async sendLoginAlert(to, details) {
        const subject = 'New Login Alert - SkyFetch';
        const text = `A new login usage detected. Time: ${new Date().toLocaleString()}. Details: ${JSON.stringify(details)}`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ffcc00; background-color: #fff9e6;">
                <h2 style="color: #d4a017;">New Login Detected</h2>
                <p>We detected a new login to your SkyFetch account.</p>
                <ul>
                    <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                    <li><strong>IP/Details:</strong> ${details.ip || 'Unknown'}</li>
                </ul>
                <p>If this wasn't you, please reset your password immediately.</p>
            </div>
        `;
        await this.sendEmail(to, subject, text, html);
    }
    async sendResourceAlert(to, resource, value, threshold) {
        const subject = `CRITICAL: High ${resource} Usage Alert - SkyFetch`;
        const text = `Your system's ${resource} usage has exceeded the threshold. Current: ${value}%. Threshold: ${threshold}%.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #d32f2f; background-color: #ffebee;">
                <h2 style="color: #c62828;">High Resource Usage Detected</h2>
                <p>Your system is experiencing high load.</p>
                <ul>
                    <li><strong>Resource:</strong> ${resource}</li>
                    <li><strong>Current Usage:</strong> <span style="font-weight:bold; color: #d32f2f;">${value}%</span></li>
                    <li><strong>Threshold:</strong> ${threshold}%</li>
                    <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                </ul>
                <p>Please check your system immediately.</p>
            </div>
        `;
        await this.sendEmail(to, subject, text, html);
    }
}

module.exports = new EmailService();
