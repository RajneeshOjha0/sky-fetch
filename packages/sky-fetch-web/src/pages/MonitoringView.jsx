import React from 'react';
import { Activity, Server, Cpu, Database, AlertTriangle } from 'lucide-react';

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
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Monitoring</h1>
                <p className="text-muted-foreground">Real-time infrastructure performance and health status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={Cpu}
                    label="CPU Usage"
                    value="42%"
                />
                <MetricCard
                    icon={Server}
                    label="Memory Usage"
                    value="1.2 GB"
                />
                <MetricCard
                    icon={Database}
                    label="DB Connections"
                    value="85"
                    status="normal"
                />
                <MetricCard
                    icon={Activity}
                    label="Ingest Rate"
                    value="2.4k/s"
                    status="warning"
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
