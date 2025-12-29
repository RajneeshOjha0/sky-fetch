import React from 'react';
import { Terminal, Search, Activity } from 'lucide-react';

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Logo / Header */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary rounded-2xl shadow-lg">
                        <Terminal className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">SkyFetch</h1>
                    <p className="text-xl text-muted-foreground">
                        Unified Log & Activity Search for Developers
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
                        <Terminal className="w-8 h-8 mb-4 text-blue-500" />
                        <h3 className="font-semibold mb-2">CLI Agent</h3>
                        <p className="text-sm text-muted-foreground">Capture terminal history and logs in real-time.</p>
                    </div>
                    <div className="p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
                        <Search className="w-8 h-8 mb-4 text-green-500" />
                        <h3 className="font-semibold mb-2">Instant Search</h3>
                        <p className="text-sm text-muted-foreground">Full-text search across all your development activity.</p>
                    </div>
                    <div className="p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
                        <Activity className="w-8 h-8 mb-4 text-purple-500" />
                        <h3 className="font-semibold mb-2">Live Timeline</h3>
                        <p className="text-sm text-muted-foreground">Visualize your coding journey on a unified timeline.</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-8">
                    <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Get Started
                    </button>
                </div>

            </div>
        </div>
    );
}

export default App;
