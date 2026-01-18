import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, Clock, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { getLogContext } from '../api';
import clsx from 'clsx';

const LogDetailsModal = ({ log, onClose }) => {
    const [contextLogs, setContextLogs] = useState({ before: [], after: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedMetadata, setExpandedMetadata] = useState(true);
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        if (showContext && log?.id) {
            fetchContext();
        }
    }, [showContext, log?.id]);

    const fetchContext = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getLogContext(log.id, 10, 10);
            setContextLogs({
                before: result.before || [],
                after: result.after || []
            });
        } catch (err) {
            console.error('Failed to fetch context:', err);
            setError('Failed to load context logs');
        } finally {
            setLoading(false);
        }
    };

    if (!log) return null;

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warn':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const renderMetadata = (metadata, depth = 0) => {
        if (!metadata || typeof metadata !== 'object') {
            return <span className="text-foreground">{JSON.stringify(metadata)}</span>;
        }

        return (
            <div className={clsx("space-y-1", depth > 0 && "ml-4")}>
                {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                        <span className="text-primary font-medium">{key}:</span>
                        {typeof value === 'object' && value !== null ? (
                            <div className="flex-1">
                                {renderMetadata(value, depth + 1)}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">
                                {typeof value === 'string' ? `"${value}"` : String(value)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderContextLog = (contextLog, isHighlight = false) => (
        <div
            key={contextLog.id}
            className={clsx(
                "p-3 rounded-lg border transition-all",
                isHighlight
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-card border-border hover:bg-muted/50"
            )}
        >
            <div className="flex items-center gap-2 text-xs mb-1">
                <span className={clsx(
                    "px-2 py-0.5 rounded text-xs font-medium uppercase",
                    {
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': contextLog.level === 'info',
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': contextLog.level === 'warn',
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': contextLog.level === 'error',
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': contextLog.level === 'debug',
                    }
                )}>
                    {contextLog.level}
                </span>
                <span className="text-muted-foreground font-mono">
                    {new Date(contextLog.timestamp).toLocaleTimeString()}
                </span>
            </div>
            <div className="font-mono text-sm text-foreground">
                {contextLog.message}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        {getLevelIcon(log.level)}
                        <div>
                            <h2 className="text-xl font-bold">Log Details</h2>
                            <p className="text-sm text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Main Log Info */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">MESSAGE</h3>
                            <pre className="font-mono text-sm whitespace-pre-wrap text-foreground bg-muted p-3 rounded">
                                {log.message}
                            </pre>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">LEVEL</h3>
                                <span className={clsx(
                                    "inline-block px-3 py-1 rounded text-sm font-medium uppercase",
                                    {
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': log.level === 'info',
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': log.level === 'warn',
                                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': log.level === 'error',
                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': log.level === 'debug',
                                    }
                                )}>
                                    {log.level}
                                </span>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">SOURCE</h3>
                                <p className="text-foreground font-medium">{log.source}</p>
                            </div>

                            {log.sessionId && (
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">SESSION ID</h3>
                                    <p className="text-foreground font-mono text-sm">{log.sessionId}</p>
                                </div>
                            )}

                            {log.hostId && (
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">HOST ID</h3>
                                    <p className="text-foreground font-mono text-sm">{log.hostId}</p>
                                </div>
                            )}

                            {log.traceId && (
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">TRACE ID</h3>
                                    <p className="text-foreground font-mono text-sm">{log.traceId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setExpandedMetadata(!expandedMetadata)}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                            >
                                <h3 className="text-sm font-semibold text-foreground">METADATA</h3>
                                {expandedMetadata ? (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                            {expandedMetadata && (
                                <div className="p-4 pt-0">
                                    <div className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
                                        {renderMetadata(log.metadata)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Context View Section */}
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowContext(!showContext)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">CONTEXT VIEW</h3>
                                <span className="text-xs text-muted-foreground">(Logs around this time)</span>
                            </div>
                            {showContext ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                        {showContext && (
                            <div className="p-4 pt-0 space-y-3">
                                {loading ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Loading context...
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8 text-red-500">
                                        {error}
                                    </div>
                                ) : (
                                    <>
                                        {contextLogs.before.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                                                    Before ({contextLogs.before.length})
                                                </h4>
                                                {contextLogs.before.map(contextLog => renderContextLog(contextLog))}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-primary uppercase">
                                                Current Log
                                            </h4>
                                            {renderContextLog(log, true)}
                                        </div>

                                        {contextLogs.after.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                                                    After ({contextLogs.after.length})
                                                </h4>
                                                {contextLogs.after.map(contextLog => renderContextLog(contextLog))}
                                            </div>
                                        )}

                                        {contextLogs.before.length === 0 && contextLogs.after.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No context logs found
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogDetailsModal;
