import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Zap, Search, Globe, Code, ChevronRight, Activity, Database, Cloud, Users, TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

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

const StatCard = ({ value, label }) => (
    <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
    </div>
);



const UseCaseCard = ({ title, description, icon: Icon }) => (
    <div className="p-6 bg-card border border-border rounded-xl">
        <Icon className="w-10 h-10 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
                <span className="font-semibold">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-muted-foreground">
                    {answer}
                </div>
            )}
        </div>
    );
};

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
                        <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
                        <a href="#integrations" className="hover:text-primary transition-colors">Integrations</a>
                        <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
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
                            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium mb-6">
                                🚀 Now with AI-powered anomaly detection
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance max-w-4xl mx-auto">
                                Debug Production Issues<br />
                                <span className="text-primary">10x Faster</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
                                SkyFetch aggregates logs, metrics, and traces from all your services into one unified platform.
                                No proprietary agents. No vendor lock-in. Just instant insights when you need them most out of the box.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    Start Free Trial <ChevronRight className="w-5 h-5" />
                                </Link>
                                <button className="px-8 py-4 bg-card border border-border rounded-full font-bold text-lg hover:bg-muted transition-all">
                                    Watch Demo
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                ✓ 14-day free trial &nbsp;•&nbsp; ✓ No credit card required &nbsp;•&nbsp; ✓ Cancel anytime
                            </p>
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
                                    <span className="ml-4 text-xs text-muted-foreground">dashboard.skyfetch.io</span>
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

                {/* Stats Section */}
                <section className="py-16 bg-card/50 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <StatCard value="99.99%" label="Uptime SLA" />
                            <StatCard value="<100ms" label="Query Latency" />
                            <StatCard value="10K+" label="Active Users" />
                            <StatCard value="50B+" label="Events/Day" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to debug faster</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                Built for modern engineering teams who need to move fast without breaking things.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Search}
                                title="Lightning-Fast Search"
                                description="Search through terabytes of logs in milliseconds with our optimized indexing. Filter by service, severity, custom tags, or full-text search across all fields."
                            />
                            <FeatureCard
                                icon={Activity}
                                title="Real-time Monitoring"
                                description="Watch logs stream in real-time with live tail. Set up intelligent alerts that notify you via Slack, PagerDuty, or email when anomalies are detected."
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Enterprise Security"
                                description="SOC 2 Type II certified with role-based access control, SSO/SAML support, audit logs, and field-level encryption for sensitive data."
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Zero Configuration"
                                description="Drop in our SDK and start seeing data instantly. Auto-instrumentation for Node.js, Python, Go, Java, and .NET with zero code changes required."
                            />
                            <FeatureCard
                                icon={Globe}
                                title="Global Infrastructure"
                                description="Low-latency ingestion from any region with edge nodes worldwide. Data residency options available for GDPR and compliance requirements."
                            />
                            <FeatureCard
                                icon={Code}
                                title="Developer Experience"
                                description="Powerful CLI tools, comprehensive REST API, webhooks, and native integrations with VS Code, IntelliJ, and your favorite development tools."
                            />
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section id="use-cases" className="py-24 bg-card/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for every team</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                From startups to enterprises, SkyFetch scales with your needs
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <UseCaseCard
                                icon={TrendingUp}
                                title="Startups & Scale-ups"
                                description="Get enterprise-grade observability without the enterprise price tag. Start free and scale as you grow with transparent, usage-based pricing."
                            />
                            <UseCaseCard
                                icon={Users}
                                title="DevOps Teams"
                                description="Reduce MTTR with correlated logs, metrics, and traces. Quickly identify root causes and resolve incidents before they impact customers."
                            />
                            <UseCaseCard
                                icon={Cloud}
                                title="Cloud-Native Apps"
                                description="Perfect for microservices, serverless, and containerized applications. Native support for Kubernetes, Docker, AWS Lambda, and more."
                            />
                        </div>
                    </div>
                </section>



                {/* Integrations Section */}
                <section id="integrations" className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrates with your entire stack</h2>
                            <p className="text-muted-foreground text-lg">Native integrations for your favorite languages, frameworks, and tools</p>
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

                {/* FAQ Section */}
                <section id="faq" className="py-24 bg-card/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
                            <p className="text-muted-foreground text-lg">Everything you need to know about SkyFetch</p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            <FAQItem
                                question="How long does it take to set up SkyFetch?"
                                answer="Most teams are up and running in under 10 minutes. Simply install our SDK, add your API key, and you'll start seeing data immediately. No complex configuration or infrastructure changes required."
                            />
                            <FAQItem
                                question="Can I migrate from my existing observability tool?"
                                answer="Yes! We provide migration guides and support for popular platforms like Datadog, New Relic, and Splunk. Our team can help you migrate your dashboards, alerts, and historical data."
                            />
                            <FAQItem
                                question="What happens if I exceed my plan limits?"
                                answer="We'll notify you before you hit your limits. You can upgrade your plan anytime or we'll automatically scale with overage charges at $0.50/GB. No data loss or service interruption."
                            />
                            <FAQItem
                                question="Is my data secure?"
                                answer="Absolutely. We're SOC 2 Type II certified with encryption at rest and in transit. We support SSO/SAML, role-based access control, and offer data residency options for compliance requirements."
                            />
                            <FAQItem
                                question="Do you offer on-premise deployment?"
                                answer="Yes, on-premise deployment is available for Enterprise customers. Contact our sales team to discuss your specific requirements and compliance needs."
                            />
                            <FAQItem
                                question="What kind of support do you provide?"
                                answer="All plans include email support. Professional plans get priority support with <4 hour response time. Enterprise customers get dedicated Slack channels and a dedicated account manager."
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 border-t border-border bg-gradient-to-b from-background to-primary/5">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to ship with confidence?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                            Join thousands of developers who trust SkyFetch for their observability needs.
                            Start your 14-day free trial today. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Get Started for Free
                            </Link>
                            <button className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 font-medium transition-colors hover:bg-muted">
                                Schedule a Demo
                            </button>
                        </div>
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
                                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                                <li><a href="#integrations" className="hover:text-foreground">Integrations</a></li>
                                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground">Changelog</a></li>
                                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                                <li><a href="#" className="hover:text-foreground">Press Kit</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-foreground">Security</a></li>
                                <li><a href="#" className="hover:text-foreground">Compliance</a></li>
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
