import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, Calendar, ListFilter, Building, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrganizations, getProjects } from '../api';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [organization, setOrganization] = useState([]);
    const [project, setProject] = useState([]);
    const [filters, setFilters] = useState({
        level: 'all',
        source: 'all',
        dateFrom: '',
        dateTo: '',
        organization: 'all',
        project: '',
        organizationId: ''
    });

    const filterRef = useRef(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ query, filters });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        console.log("useEffect");
        const fetchData = async () => {
            const data = await getOrganizations();
            setOrganization(data.data.organizations);
        }
        fetchData();
    }, []);
    useEffect(() => {
        const fetchProjects = async (organizationId) => {
            const data = await getProjects(organizationId);
            console.log(data)
            setProject(data.data.projects);
        }
        if (filters.organizationId) {
            fetchProjects(filters.organizationId);
        }
        // console.log(filters.organizationId, "kamlesh")
    }, [filters.organization])
    // console.log(organization)
    // console.log(project)
    return (
        <div ref={filterRef} className="w-full max-w-3xl relative z-20">
            <form onSubmit={handleSubmit} className="relative flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search logs..."
                        className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted border-border'}`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filters</span>
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                    Search
                </button>
            </form>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {/* Log Level */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <ListFilter className="w-3 h-3" /> Level
                            </label>
                            <select
                                value={filters.level}
                                onChange={(e) => handleFilterChange('level', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">All Levels</option>
                                <option value="info">Info</option>
                                <option value="warn">Warning</option>
                                <option value="error">Error</option>
                                <option value="debug">Debug</option>
                            </select>
                        </div>

                        {/* Source */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <ListFilter className="w-3 h-3" /> Source
                            </label>
                            <select
                                value={filters.source}
                                onChange={(e) => handleFilterChange('source', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">All Sources</option>
                                <option value="terminal">Terminal</option>
                                <option value="github">GitHub</option>
                                <option value="gitlab">GitLab</option>
                                <option value="ci">CI/CD</option>
                            </select>
                        </div>

                        {/* Organization */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Building className="w-3 h-3" /> Organization
                            </label>
                            <select
                                value={filters.organization}
                                onChange={(e) => {
                                    // console.log("45455656", e.target.name)
                                    handleFilterChange('organization', e.target.name)
                                    handleFilterChange('organizationId', e.target.value)
                                }
                                }
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all" name="all">All Organizations</option>
                                {organization?.map((org) => {
                                    console.log(org._id)
                                    return (<option key={org._id} value={org._id} name={org.name} >
                                        {org.name}
                                    </option>)
                                })}

                            </select>
                        </div>

                        {/* Project */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> Project
                            </label>
                            <select
                                value={filters.project}
                                onChange={(e) => handleFilterChange('project', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="all">All Projects</option>
                                {project?.map((project) => {
                                    console.log(project._id)
                                    return (<option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>)
                                })}

                            </select>
                        </div>

                        {/* Project */}
                        {/* <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> Project
                            </label>
                            <input
                                type="text"
                                placeholder="Filter by Project"
                                value={filters.project}
                                onChange={(e) => handleFilterChange('project', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div> */}

                        {/* Date From */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> From
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* Date To */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> To
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
