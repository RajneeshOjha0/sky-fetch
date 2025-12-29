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
    verifyEmail
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

router.get('/keys', getApiKeys);
router.post('/keys', generateApiKey);

module.exports = router;
