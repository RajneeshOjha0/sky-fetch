import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Key, LogOut, Menu, X, Activity, User, ChevronDown, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile } from '../api';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </Link>
);

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);

    // User state
    const [user, setUser] = useState({
        name: 'Loading...',
        email: '...',
        avatar: 'U'
    });

    useEffect(() => {
        const loadUser = async () => {
            // Try local storage first for immediate render
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setUser({
                        ...parsed,
                        avatar: parsed.avatar || parsed.name.charAt(0).toUpperCase()
                    });
                } catch (e) { console.error('Failed to parse user', e); }
            }

            // Fetch fresh profile in background
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setUser({
                        ...profile,
                        avatar: profile.avatar || profile.name.charAt(0).toUpperCase()
                    });
                    localStorage.setItem('user', JSON.stringify(profile));
                }
            } catch (error) {
                console.error('Failed to load profile in dashboard', error);
                // If 401, handleLogout() might be triggered by api.js or here
            }
        };
        loadUser();

    }, []);

    // console.log("kamlesh")

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black z-10 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 256 : 0,
                    opacity: isSidebarOpen ? 1 : 0,
                    x: isSidebarOpen ? 0 : -256
                }}
                className={`fixed md:relative z-20 h-screen bg-card border-r border-border overflow-hidden md:translate-x-0 ${!isSidebarOpen && 'hidden md:block'}`}
                style={{ width: isSidebarOpen ? 256 : 0 }}
            >
                <div className="p-6 w-64 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary rounded-lg">
                            <Terminal className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SkyFetch</span>
                    </div>

                    <nav className="space-y-2 flex-1">
                        <SidebarItem
                            to="/dashboard"
                            icon={Activity}
                            label="Live Logs"
                            active={location.pathname === '/dashboard'}
                        />
                        <SidebarItem
                            to="/dashboard/keys"
                            icon={Key}
                            label="API Keys"
                            active={location.pathname === '/dashboard/keys'}
                        />
                        <SidebarItem
                            to="/dashboard/organizations"
                            icon={Building}
                            label="Organizations"
                            active={location.pathname === '/dashboard/organizations'}
                        />
                        <SidebarItem
                            to="/dashboard/profile"
                            icon={User}
                            label="Profile"
                            active={location.pathname === '/dashboard/profile'}
                        />
                        <SidebarItem
                            to="/dashboard/monitoring"
                            icon={Activity}
                            label="Monitoring"
                            active={location.pathname === '/dashboard/monitoring'}
                        />
                    </nav>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-lg md:block hidden">
                        <Menu className="w-5 h-5" />
                    </button>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-lg md:hidden block">
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors border border-transparent hover:border-border outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user.avatar}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-1 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Profile Settings
                                    </Link>
                                    <div className="h-px bg-border my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
