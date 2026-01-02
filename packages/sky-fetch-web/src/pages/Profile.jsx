import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Building, Briefcase, Save, AlertCircle, CheckCircle, Edit2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile, updateUserProfile, updatePassword } from '../api';

const Profile = () => {
    // Simulated user state
    const [user, setUser] = useState({
        name: '',
        email: '',
        organization: '',
        project: '',
        avatar: ''
    });

    // Form States
    const [generalForm, setGeneralForm] = useState({
        name: '',
        organization: '',
        project: ''
    });
    const [emailForm, setEmailForm] = useState({ email: '' });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState({ general: false, email: false, password: false, initial: true });
    const [status, setStatus] = useState({ type: '', message: '' });

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserProfile();
                setUser(prev => ({
                    ...prev,
                    ...userData,
                    avatar: userData.avatar || userData.name.charAt(0).toUpperCase()
                }));
                // console.log(user, "User");
            } catch (err) {
                setStatus({ type: 'error', message: 'Failed to load profile' });
            } finally {
                setLoading(prev => ({ ...prev, initial: false }));
            }
        };
        fetchUser();
    }, []);

    // Sync form with user state when user updates
    useEffect(() => {
        setGeneralForm({
            name: user.name || '',
            organization: user.organization || '',
            project: user.project || ''
        });
        setEmailForm({ email: user.email || '' });
    }, [user]);

    // Clear status after 3 seconds
    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => setStatus({ type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleUpdateGeneral = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, general: true }));

        try {
            const updatedUser = await updateUserProfile({
                ...user,
                name: generalForm.name,
                organization: generalForm.organization,
                project: generalForm.project
            });
            setUser(prev => ({ ...prev, ...updatedUser }));
            setStatus({ type: 'success', message: 'Profile updated successfully.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update profile' });
        } finally {
            setLoading(prev => ({ ...prev, general: false }));
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, email: true }));

        if (!emailForm.email.includes('@')) {
            setStatus({ type: 'error', message: 'Please enter a valid email address.' });
            setLoading(prev => ({ ...prev, email: false }));
            return;
        }

        try {
            const updatedUser = await updateUserProfile({
                ...user,
                email: emailForm.email
            });
            setUser(prev => ({ ...prev, ...updatedUser }));
            setStatus({ type: 'success', message: 'Email updated successfully.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update email' });
        } finally {
            setLoading(prev => ({ ...prev, email: false }));
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, password: true }));

        if (passwordForm.new.length < 8) {
            setStatus({ type: 'error', message: 'New password must be at least 8 characters.' });
            setLoading(prev => ({ ...prev, password: false }));
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            setLoading(prev => ({ ...prev, password: false }));
            return;
        }

        try {
            await updatePassword(passwordForm.current, passwordForm.new);
            setPasswordForm({ current: '', new: '', confirm: '' });
            setStatus({ type: 'success', message: 'Password updated successfully.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update password' });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    if (loading.initial) {
        return <div className="flex h-full items-center justify-center p-12"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences.</p>
            </div>

            {/* Status Toast */}
            <div className="h-4 relative z-50">
                <AnimatePresence>
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`absolute left-0 right-0 mx-auto w-max px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg border text-sm font-medium ${status.type === 'error'
                                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'
                                : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300'
                                }`}
                        >
                            {status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* General Info Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-4 bg-muted/20">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <h2 className="font-semibold">General Information</h2>
                </div>

                <div className="p-6 md:flex gap-8 items-start">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-4 mb-6 md:mb-0">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold border-4 border-background shadow-inner">
                            {user.avatar}
                        </div>
                        {/* <button className="text-sm text-primary hover:underline">Change Avatar</button> */}
                    </div>

                    {/* General Form */}
                    <form onSubmit={handleUpdateGeneral} className="flex-1 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={generalForm.name}
                                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Organization</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={generalForm.organization}
                                    onChange={(e) => setGeneralForm({ ...generalForm, organization: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Current Project</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={generalForm.project}
                                    onChange={(e) => setGeneralForm({ ...generalForm, project: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading.general}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading.general ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Update Email */}
                <div className="p-6 bg-card border border-border rounded-xl h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Email Address</h3>
                            <p className="text-xs text-muted-foreground">Update your contact email</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateEmail} className="space-y-4 flex-1 flex flex-col">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                value={emailForm.email}
                                onChange={e => setEmailForm({ email: e.target.value })}
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading.email || user.email === emailForm.email}
                            className="mt-auto w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                        >
                            {loading.email ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
                            Save Email
                        </button>
                    </form>
                </div>

                {/* Update Password */}
                <div className="p-6 bg-card border border-border rounded-xl h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Security</h3>
                            <p className="text-xs text-muted-foreground">Change your password</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={passwordForm.current}
                                    onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.new}
                                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.confirm}
                                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading.password || !passwordForm.current || !passwordForm.new}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                        >
                            {loading.password ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
