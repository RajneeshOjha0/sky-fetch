const express = require('express');
const router = express.Router();
const {
    createOrganization,
    getOrganizations,
    createProject,
    getProjects
} = require('../controllers/project.controller');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/organizations')
    .post(createOrganization)
    .get(getOrganizations);

router.route('/projects')
    .post(createProject)
    .get(getProjects);

module.exports = router;
