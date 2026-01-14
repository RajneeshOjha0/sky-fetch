import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Trash, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiKeys, generateApiKey, getOrganizations, getProjects, revealApiKey } from '../api';

const KeysView = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [newKey, setNewKey] = useState(null);
    const [keyName, setKeyName] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [projects, setProjects] = useState({});
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [copied, setCopied] = useState(false);

    // Password modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedKeyId, setSelectedKeyId] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [revealing, setRevealing] = useState(false);
    const [revealedKeys, setRevealedKeys] = useState({});

    // Fetch keys on mount
    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const [keysRes, orgRes] = await Promise.all([
                getApiKeys(),
                getOrganizations()
            ]);

            if (keysRes.status === 'success') {
                setKeys(keysRes.data.keys);
            }

            if (orgRes.status === 'success') {
                setOrganizations(orgRes.data.organizations);
                // Pre-load projects
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const result = await generateApiKey(keyName, selectedProject);
            if (result.status === 'success') {
                setNewKey(result.data.key);
                setKeyName('');
                fetchKeys(); // Refresh list
            }
        } catch (err) {
            console.error("Failed to generate key");
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (newKey) {
            navigator.clipboard.writeText(newKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRevealKey = (keyId) => {
        setSelectedKeyId(keyId);
        setShowPasswordModal(true);
        setPassword('');
        setPasswordError('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setRevealing(true);

        try {
            const result = await revealApiKey(selectedKeyId, password);
            if (result.status === 'success') {
                // Store the revealed key temporarily
                setRevealedKeys(prev => ({
                    ...prev,
                    [selectedKeyId]: result.data.key
                }));
                setShowPasswordModal(false);
                setPassword('');
            }
        } catch (err) {
            setPasswordError(err.message || 'Incorrect password');
        } finally {
            setRevealing(false);
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPassword('');
        setPasswordError('');
        setSelectedKeyId(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground">Manage your secret keys for CLI and API access out of the box.</p>
                </div>
            </div>

            {/* Generate Key Form */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Generate New Key</h3>
                <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Organization</label>
                            <select
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={selectedOrg}
                                onChange={e => {
                                    setSelectedOrg(e.target.value);
                                    setSelectedProject('');
                                }}
                                required
                            >
                                <option value="">Select Organization</option>
                                {organizations.map(org => (
                                    <option key={org._id} value={org._id}>{org.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Project</label>
                            <select
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={selectedProject}
                                onChange={e => setSelectedProject(e.target.value)}
                                disabled={!selectedOrg}
                                required
                            >
                                <option value="">Select Project</option>
                                {projects[selectedOrg]?.map(proj => (
                                    <option key={proj._id} value={proj._id}>{proj.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Key Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Production Server"
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                value={keyName}
                                onChange={(e) => setKeyName(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={generating || !selectedProject}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            {generating ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Plus className="w-4 h-4" />}
                            Generate
                        </button>
                    </div>
                </form>

                <AnimatePresence>
                    {newKey && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-green-800 dark:text-green-300">Your new API key</span>
                                <span className="text-xs text-muted-foreground">Make sure to copy it now. You won't see it again!</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 p-3 bg-white dark:bg-black text-black dark:text-white rounded border border-border font-mono text-sm break-all">
                                    {newKey}
                                </code>
                                <button onClick={copyToClipboard} className="p-3 bg-white dark:bg-black border rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Key List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Keys</h3>
                <div className="bg-card rounded-xl border border-border divide-y divide-border">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading keys...</div>
                    ) : keys.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No API keys found. Generate one to get started.</div>
                    ) : (
                        keys.map((key) => (
                            <div key={key._id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded">
                                        <Key className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{key.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {revealedKeys[key._id] || key.key}
                                            • Created {new Date(key.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleRevealKey(key._id)}
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                        title="Reveal API key"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={closePasswordModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card p-6 rounded-xl border border-border shadow-xl max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Verify Password</h3>
                                <button
                                    onClick={closePasswordModal}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Enter your password to reveal the full API key.
                            </p>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoFocus
                                        required
                                    />
                                    {passwordError && (
                                        <p className="text-sm text-red-500">{passwordError}</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closePasswordModal}
                                        className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={revealing}
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {revealing ? (
                                            <>
                                                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                Verifying...
                                            </>
                                        ) : (
                                            'Reveal Key'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KeysView;
