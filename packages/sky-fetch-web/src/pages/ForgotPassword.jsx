import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to send reset code");
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
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
                        <p className="text-muted-foreground text-center mt-2">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        Send instructions <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-green-500/10 text-green-500 rounded-lg">
                            <p className="font-medium">Check your email!</p>
                            <p className="text-sm mt-1">We've sent a code to {email}. Redirecting...</p>
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to log in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
