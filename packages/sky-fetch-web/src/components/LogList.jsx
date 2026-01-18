import React from 'react';
import clsx from 'clsx';
import { Terminal, Github, Gitlab, Server } from 'lucide-react';

const SourceIcon = ({ source }) => {
    switch (source) {
        case 'terminal': return <Terminal className="w-4 h-4" />;
        case 'github': return <Github className="w-4 h-4" />;
        case 'gitlab': return <Gitlab className="w-4 h-4" />;
        default: return <Server className="w-4 h-4" />;
    }
};

const LogList = ({ logs = [], onLogClick }) => {
    if (!logs.length) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No logs found. Try searching for something else or please check your filters.
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl space-y-4">
            {logs.map((log) => (
                <div
                    key={log.id}
                    className="p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                    onClick={() => onLogClick && onLogClick(log)}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "px-2 py-1 rounded text-xs font-medium uppercase",
                                {
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': log.level === 'info',
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': log.level === 'warn',
                                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': log.level === 'error',
                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': log.level === 'debug',
                                }
                            )}>
                                {log.level}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {new Date(log.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <SourceIcon source={log.source} />
                            <span>{log.source}</span>
                        </div>
                    </div>
                    <div className="mt-2 font-mono text-sm whitespace-pre-wrap line-clamp-3">
                        {log.message}
                    </div>
                    {log.metadata && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            <span className="bg-muted px-2 py-1 rounded">
                                + metadata
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LogList;
