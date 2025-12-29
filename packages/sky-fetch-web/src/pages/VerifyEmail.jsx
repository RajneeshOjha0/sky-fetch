import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { verifyEmail } from '../api';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.email || '';

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await verifyEmail(email, otp);

            if (data.token) {
                setSuccess(true);
                localStorage.setItem('token', data.token);
                if (data.data && data.data.user) {
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                }

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setError("Verification failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Invalid Code");
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
                        <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
                        <p className="text-muted-foreground text-center mt-2">
                            We've sent a 6-digit verification code to <span className="font-medium text-foreground">{email || 'your email'}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input (Visible only if not passed from signup) */}
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

                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-500/10 text-green-500 text-sm rounded-lg text-center flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" /> Verified! Redirecting...
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Verify Email <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Didn't receive the code? </span>
                        <button className="text-primary hover:underline font-medium">Resend</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
