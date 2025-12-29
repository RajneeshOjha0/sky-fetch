import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '../api';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.email || '';

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(email, otp, newPassword);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl z-10 overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="p-3 bg-primary/10 rounded-xl mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
                        <p className="text-muted-foreground text-center mt-2">
                            Must be at least 6 characters.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!initialEmail && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium ml-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono text-center text-xl tracking-[0.5em]"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-medium ml-1">New password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none pr-10"
                                        placeholder="••••••••"
                                        required
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

                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Reset password <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-green-500/10 text-green-500 rounded-lg flex flex-col items-center">
                            <Check className="w-12 h-12 mb-2" />
                            <p className="font-medium text-lg">Password reset!</p>
                            <p className="text-sm mt-1">Redirecting to login...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
