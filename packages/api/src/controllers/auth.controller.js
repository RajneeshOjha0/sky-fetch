const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const ApiKey = require('../models/apikey.model');
const EmailService = require('../services/email.service');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
        expiresIn: '30d'
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
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

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
        EmailService.sendLoginAlert(user.email, { ip: req.ip }).catch(console.error);

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

exports.getApiKeys = async (req, res) => {
    try {
        const keys = await ApiKey.find({ user: req.user.id });
        res.status(200).json({
            status: 'success',
            data: { keys }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.generateApiKey = async (req, res) => {
    try {
        const { name } = req.body;
        const key = ApiKey.generate();
        const newKey = await ApiKey.create({
            key,
            owner: name || 'CLI Key',
            user: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { key: newKey.key, name: newKey.owner }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
