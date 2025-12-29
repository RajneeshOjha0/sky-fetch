import React, { useState, useEffect } from 'react';
import { Building, Plus, Folder, Briefcase } from 'lucide-react';
import { createOrganization, getOrganizations, createProject, getProjects } from '../api';
import { motion } from 'framer-motion';

const OrganizationSettings = () => {
    const [organizations, setOrganizations] = useState([]);
    const [projects, setProjects] = useState({}); // Map orgId -> projects
    const [loading, setLoading] = useState(true);
    const [newOrgName, setNewOrgName] = useState('');
    const [newProjectName, setNewProjectName] = useState({}); // Map orgId -> input value
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const orgRes = await getOrganizations();
            if (orgRes.status === 'success') {
                setOrganizations(orgRes.data.organizations);

                // Fetch projects for each org
                const projectData = {};
                for (const org of orgRes.data.organizations) {
                    const projRes = await getProjects(org._id);
                    if (projRes.status === 'success') {
                        projectData[org._id] = projRes.data.projects;
                    }
                }
                setProjects(projectData);
            }
        } catch (err) {
            console.error("Failed to load hierarchy", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        setLoadingAction(true);
        try {
            const res = await createOrganization(newOrgName);
            if (res.status === 'success') {
                setNewOrgName('');
                fetchHierarchy();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleCreateProject = async (e, orgId) => {
        e.preventDefault();
        const name = newProjectName[orgId];
        if (!name) return;

        setLoadingAction(true);
        try {
            const res = await createProject(name, orgId);
            if (res.status === 'success') {
                setNewProjectName(prev => ({ ...prev, [orgId]: '' }));
                // Specific refresh might be better, but full refresh is safer for sync
                fetchHierarchy();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Organization Settings</h1>
                <p className="text-muted-foreground">Manage your organizations and projects.</p>
            </div>

            {/* Create Org */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <form onSubmit={handleCreateOrg} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">New Organization Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="e.g. Acme Corp"
                                className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loadingAction}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        {loadingAction ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Plus className="w-4 h-4" />}
                        Create Org
                    </button>
                </form>
            </div>

            {/* Org List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-10 opacity-50">Loading organizations...</div>
                ) : organizations.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-xl">
                        <Building className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-muted-foreground">No organizations found. Create one to get started.</p>
                    </div>
                ) : (
                    organizations.map(org => (
                        <motion.div
                            key={org._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Building className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{org.name}</h3>
                                        <p className="text-xs text-muted-foreground">Owner</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-background border rounded text-muted-foreground">
                                    {projects[org._id]?.length || 0} Projects
                                </span>
                            </div>

                            <div className="p-6">
                                <h4 className="text-sm font-medium mb-4 flex items-center gap-2 text-muted-foreground">
                                    <Folder className="w-4 h-4" /> Projects
                                </h4>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {projects[org._id]?.map(proj => (
                                        <div key={proj._id} className="p-4 bg-background border border-border rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                            <span className="font-medium truncate">{proj.name}</span>
                                        </div>
                                    ))}
                                    {(!projects[org._id] || projects[org._id].length === 0) && (
                                        <div className="col-span-full text-sm text-muted-foreground italic py-2">
                                            No projects yet.
                                        </div>
                                    )}
                                </div>

                                {/* Create Project Form */}
                                <form onSubmit={(e) => handleCreateProject(e, org._id)} className="flex gap-3 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="New Project Name"
                                        className="flex-1 px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        value={newProjectName[org._id] || ''}
                                        onChange={(e) => setNewProjectName(prev => ({ ...prev, [org._id]: e.target.value }))}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loadingAction}
                                        className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Project
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrganizationSettings;
