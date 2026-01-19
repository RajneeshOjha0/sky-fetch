const Project = require('../models/project.model');
const Organization = require('../models/organization.model');

// --- Organization Controllers ---

exports.createOrganization = async (req, res) => {
    try {
        const { name } = req.body;

        const org = await Organization.create({
            name,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'admin' }]
        });

        res.status(201).json({ status: 'success', data: { organization: org } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        // Find orgs where user is a member
        const orgs = await Organization.find({
            'members.user': req.user._id
        });

        res.status(200).json({ status: 'success', data: { organizations: orgs } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// --- Project Controllers ---

exports.createProject = async (req, res) => {
    try {
        const { name, organizationId } = req.body;

        // Verify user is member of org
        const org = await Organization.findOne({
            _id: organizationId,
            'members.user': req.user._id
        });

        if (!org) {
            return res.status(403).json({ status: 'error', message: 'Not authorized for this organization' });
        }

        const project = await Project.create({
            name,
            organization: organizationId
        });

        res.status(201).json({ status: 'success', data: { project } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
//get project by organization id
exports.getProjects = async (req, res) => {
    try {
        const { organizationId } = req.query;

        if (!organizationId) {
            return res.status(400).json({ status: 'error', message: 'Organization ID is required' });
        }

        // Verify access (optional: strictly enforce if valid org member)
        const org = await Organization.findOne({
            _id: organizationId,
            'members.user': req.user._id
        });

        if (!org) {
            return res.status(403).json({ status: 'error', message: 'Not authorized for this organization' });
        }

        const projects = await Project.find({ organization: organizationId });

        res.status(200).json({ status: 'success', data: { projects } });
    } catch (error) {
        console.log('[ERROR] error in fetching projects', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
