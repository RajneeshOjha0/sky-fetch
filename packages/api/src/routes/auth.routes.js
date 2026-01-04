const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    getApiKeys,
    generateApiKey,
    revealApiKey,
    verifyEmail,
    resendOTP,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

router.get('/keys', getApiKeys);
router.post('/keys', generateApiKey);
router.post('/keys/:id/reveal', revealApiKey);

module.exports = router;
