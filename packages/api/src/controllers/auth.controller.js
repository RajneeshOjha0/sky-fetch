const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const ApiKey = require('../models/apikey.model');
const EmailService = require('../services/email.service');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
        expiresIn: '1d'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, organization, project } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // 10 mins

        const user = await User.create({
            name,
            email,
            password,
            organization,
            project,
            otp,
            otpExpires,
            isVerified: false
        });

        // Send OTP Email
        await EmailService.sendOTP(email, otp);

        // Do NOT send token. User must verify.
        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Please verify your email.',
            data: {
                email: user.email // Send back email for frontend to use in verification screen
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email }).select('+otp +otpExpires');

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 'error', message: 'Email already verified' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    organization: user.organization,
                    project: user.project,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 'error', message: 'Email already verified' });
        }

        // Generate New OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP Email
        await EmailService.sendOTP(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Verification code resent successfully'
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ status: 'error', message: 'Please verify your email first' });
        }

        const token = signToken(user._id);

        // Send login alert (async, don't wait)
        // EmailService.sendLoginAlert(user.email, { ip: req.ip }).catch(console.error);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    organization: user.organization,
                    project: user.project,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, organization, project } = req.body;

        // Prevent password update via this route
        const user = await User.findByIdAndUpdate(req.user.id, {
            name, email, organization, project
            // Add avatar logic if needed based on name char
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// --- API Keys ---

// Helper function to mask API key
const maskApiKey = (key) => {
    if (!key || key.length < 8) return key;
    const firstFour = key.substring(0, 4);
    const lastFour = key.substring(key.length - 4);
    return `${firstFour}${'*'.repeat(12)}${lastFour}`;
};

exports.getApiKeys = async (req, res) => {
    try {
        const keys = await ApiKey.find({ createdBy: req.user.id }).populate('project', 'name');
        // Mask the keys before sending
        const maskedKeys = keys.map(key => ({
            ...key.toObject(),
            key: maskApiKey(key.key)
        }));
        res.status(200).json({
            status: 'success',
            data: { keys: maskedKeys }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.generateApiKey = async (req, res) => {
    try {
        const { name, projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({ status: 'error', message: 'Project ID is required' });
        }

        // Verify user access to project (via Org)
        const project = await require('../models/project.model').findById(projectId).populate('organization');
        if (!project) {
            return res.status(404).json({ status: 'error', message: 'Project not found' });
        }

        // Check if user is member of the project's organization
        const org = await require('../models/organization.model').findOne({
            _id: project.organization._id,
            'members.user': req.user.id
        });

        if (!org) {
            return res.status(403).json({ status: 'error', message: 'You do not have access to this project' });
        }

        const key = ApiKey.generate();
        const newKey = await ApiKey.create({
            key,
            name: name || 'CLI Key',
            project: projectId,
            createdBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { key: newKey.key, name: newKey.name, project: project.name }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.revealApiKey = async (req, res) => {
    try {
        const { password } = req.body;
        const keyId = req.params.id;

        if (!password) {
            return res.status(400).json({ status: 'error', message: 'Password is required' });
        }

        // Verify password
        const user = await User.findById(req.user.id).select('+password');
        if (!(await user.matchPassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Incorrect password' });
        }

        // Find the API key and verify ownership
        const apiKey = await ApiKey.findOne({ _id: keyId, createdBy: req.user.id });
        if (!apiKey) {
            return res.status(404).json({ status: 'error', message: 'API key not found' });
        }

        // Return the full key
        res.status(200).json({
            status: 'success',
            data: { key: apiKey.key }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// --- Forgot Password ---

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await EmailService.sendPasswordReset(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Password reset code sent to email'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email }).select('+otp +otpExpires +password');

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
        }

        user.password = newPassword; // Will be hashed by pre-save hook
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset successful. You can now login.'
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
