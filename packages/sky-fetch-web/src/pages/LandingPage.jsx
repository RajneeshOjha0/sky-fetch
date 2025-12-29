import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Zap, Search, Globe, Code, ChevronRight, Activity, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all"
    >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

const IntegrationLogo = ({ name }) => (
    <div className="flex items-center justify-center p-6 bg-background rounded-xl border border-border grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
        <span className="font-bold text-lg">{name}</span>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">SkyFetch</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#integrations" className="hover:text-primary transition-colors">Integrations</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance max-w-4xl mx-auto">
                                See it all in one place.<br />
                                <span className="text-primary">Zero-Config Observability.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
                                Aggregating logs, metrics, and traces from all your services.
                                No proprietary agents. No complexity. Just clear insights.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    Start Free Trial <ChevronRight className="w-5 h-5" />
                                </Link>
                                <button className="px-8 py-4 bg-card border border-border rounded-full font-bold text-lg hover:bg-muted transition-all">
                                    Request Demo
                                </button>
                            </div>
                        </motion.div>

                        {/* Interactive Graph Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-20 max-w-5xl mx-auto"
                        >
                            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                                <div className="h-10 border-b border-border bg-muted/50 flex items-center gap-2 px-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="p-1 md:p-4 bg-muted/20">
                                    <img
                                        src="https://placehold.co/1200x600/1e1e1e/3b82f6?text=Live+Dashboard+Preview"
                                        alt="Dashboard Preview"
                                        className="w-full rounded-lg border border-border/50 shadow-sm"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-card/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Everything you need to debug faster</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Built for modern engineering teams who need to move fast without breaking things.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Search}
                                title="Instant Search"
                                description="Search through terabytes of logs in milliseconds. Filter by service, level, or custom tags."
                            />
                            <FeatureCard
                                icon={Activity}
                                title="Real-time Monitoring"
                                description="Watch logs stream in real-time. Spot errors as they happen, not hours later."
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Enterprise Security"
                                description="Role-based access control, SSO, and audit logs keep your data secure."
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Zero Configuration"
                                description="Drop in our SDK and start seeing data instantly. Auto-instrumentation for Node, Python, and Go."
                            />
                            <FeatureCard
                                icon={Globe}
                                title="Global Availability"
                                description="Low-latency ingestion from any region. Data residency options available."
                            />
                            <FeatureCard
                                icon={Code}
                                title="Developer First"
                                description="CLI tools, API access, and integrations with your favorite IDEs."
                            />
                        </div>
                    </div>
                </section>

                {/* Integrations Section */}
                <section id="integrations" className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Works with your stack</h2>
                            <p className="text-muted-foreground">Native integrations for your favorite languages and tools.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                            <IntegrationLogo name="Node.js" />
                            <IntegrationLogo name="Python" />
                            <IntegrationLogo name="Go" />
                            <IntegrationLogo name="Docker" />
                            <IntegrationLogo name="Kubernetes" />
                            <IntegrationLogo name="AWS" />
                            <IntegrationLogo name="Vercel" />
                            <IntegrationLogo name="GitHub" />
                            <IntegrationLogo name="Slack" />
                            <IntegrationLogo name="PagerDuty" />
                            <IntegrationLogo name="Grafana" />
                            <IntegrationLogo name="Prometheus" />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 border-t border-border bg-gradient-to-b from-background to-primary/5">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to regain control?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Join thousands of developers who trust SkyFetch for their observability needs.
                            Start your 14-day free trial today.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border py-12 bg-card">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Terminal className="w-5 h-5 text-primary" />
                                <span className="font-bold">SkyFetch</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Making observability simple and accessible for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">Features</a></li>
                                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
                                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-foreground">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
                        &copy; {new Date().getFullYear()} SkyFetch Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
