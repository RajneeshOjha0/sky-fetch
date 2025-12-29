import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LogList from '../components/LogList';
import { searchLogs } from '../api';

const LogsView = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (searchParams) => {
        // Handle both initial string call or object from SearchBar
        const query = typeof searchParams === 'string' ? searchParams : searchParams.query;
        const filters = typeof searchParams === 'string' ? {} : (searchParams.filters || {});

        setLoading(true);
        setError(null);
        try {
            const results = await searchLogs(query, filters);
            const logData = Array.isArray(results) ? results : (results.data || []);
            setLogs(logData);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch logs. Is the API running?');
        } finally {
            setLoading(false);
        }
    };

    // Load initial logs
    useEffect(() => {
        handleSearch({ query: '' });
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Live Logs</h1>
                    <p className="text-muted-foreground">Real-time terminal and application logs.</p>
                </div>
                <div className="w-full md:w-auto">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border min-h-[500px] p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
                        <Activity className="w-8 h-8 animate-spin text-primary" />
                        <span>Fetching latest logs...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-8 rounded-lg text-center border border-red-100 dark:border-red-900">
                        {error}
                    </div>
                ) : (
                    <LogList logs={logs} />
                )}
            </div>
        </div>
    );
};

export default LogsView;
