const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Create transporter (using Ethereal for dev if no env vars)
        // In production, these should be securely injected
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER || 'ethereal_user',
                pass: process.env.SMTP_PASS || 'ethereal_pass'
            }
        });
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
}

module.exports = new EmailService();
