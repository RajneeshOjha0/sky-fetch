import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, Database, AlertTriangle } from 'lucide-react';
import { getOrganizations, getProjects } from '../api';

const MetricCard = ({ icon: Icon, label, value, status = 'normal' }) => {
    const statusColor =
        status === 'warning' ? 'text-yellow-500' :
            status === 'error' ? 'text-red-500' :
                'text-green-500';

    return (
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground font-medium mb-1">{label}</span>
                    <span className="text-2xl font-bold font-mono">{value}</span>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${statusColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-muted-foreground capitalize">{status} operating range</span>
            </div>
        </div>
    );
};

const MonitoringView = () => {
    const [metrics, setMetrics] = useState({
        cpu: { usage: '...', status: 'normal' },
        memory: { value: '...', status: 'normal' },
        db: { connections: '...', status: 'normal' },
        ingest: { rate: '...', status: 'normal' }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // 1. Get Organizations
                const orgsData = await getOrganizations();
                const orgs = orgsData.data.organizations;
                if (!orgs || orgs.length === 0) return;

                // 2. Get Projects for first Org
                const projectsData = await getProjects(orgs[0]._id);
                const projects = projectsData.data.projects;
                if (!projects || projects.length === 0) return;

                // 3. Get Metrics from first Project
                const project = projects[0];
                if (project.metrics) {
                    setMetrics({
                        cpu: {
                            usage: `${project.metrics.cpu || 0}%`,
                            status: (project.metrics.cpu || 0) > 80 ? 'warning' : 'normal'
                        },
                        memory: {
                            value: `${project.metrics.memoryUsedGB || 0} GB`,
                            status: (project.metrics.memory || 0) > 80 ? 'warning' : 'normal'
                        },
                        db: { connections: 'Active', status: 'normal' }, // Placeholder as this is client side
                        ingest: { rate: 'Active', status: 'normal' } // Placeholder
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Monitoring</h1>
                <p className="text-muted-foreground">Real-time performance from your active CLI agent.</p>
            </div>

            {/* ... rest of the UI ... */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={Cpu}
                    label="CPU Usage"
                    value={metrics.cpu.usage}
                    status={metrics.cpu.status}
                />
                <MetricCard
                    icon={Server}
                    label="Memory Usage"
                    value={metrics.memory.value}
                    status={metrics.memory.status}
                />
                {/* <MetricCard
                    icon={Database}
                    label="DB Connections"
                    value={metrics.db.connections}
                    status={metrics.db.status}
                /> */}
                <MetricCard
                    icon={Activity}
                    label="Ingest Rate"
                    value={metrics.ingest.rate}
                    status={metrics.ingest.status}
                />
            </div>

            {/* Placeholder for Grafana / Prometheus Integration */}
            <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-4 bg-muted/20">
                <div className="p-4 bg-muted rounded-full">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">External Monitoring Integration</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">
                        Prometheus and Grafana dashboards will be embedded here in production.
                        Backend instrumentation is required for live data.
                    </p>
                </div>
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    Configure Data Source
                </button>
            </div>
        </div>
    );
};

export default MonitoringView;
