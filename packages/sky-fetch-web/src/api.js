const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
            // Optional: Handle token expiration/logout here
            // localStorage.removeItem('token'); 
        }
        throw new Error(errorData.message || `Error: ${response.statusText}`);
    }
    return await response.json();
};

export const searchLogs = async (query = '', filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (filters.level && filters.level !== 'all') params.append('level', filters.level);
        if (filters.source && filters.source !== 'all') params.append('source', filters.source);
        if (filters.dateFrom) params.append('from', filters.dateFrom);
        if (filters.dateTo) params.append('to', filters.dateTo);
        if (filters.organization) params.append('organization', filters.organization);
        if (filters.project) params.append('project', filters.project);
        // Add pagination defaults if needed
        params.append('limit', '100');

        const response = await fetch(`${API_URL}/api/logs/search?${params.toString()}`, {
            headers: getHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Failed to search logs:", error);
        throw error;
    }
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
};

export const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    return await handleResponse(response);
};

export const verifyEmail = async (email, otp) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
    return await handleResponse(response);
};

export const resendOTP = async (email) => {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return await handleResponse(response);
};

export const generateApiKey = async (name, projectId) => {
    const response = await fetch(`${API_URL}/auth/keys`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, projectId }),
    });
    return await handleResponse(response);
};

export const getApiKeys = async () => {
    const response = await fetch(`${API_URL}/auth/keys`, {
        headers: getHeaders(),
    });
    return await handleResponse(response);
};

export const getUserProfile = async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getHeaders(),
    });
    const result = await handleResponse(response);
    return result.data.user; // Unwrapping the response structure
};

export const updateUserProfile = async (data) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result.data.user;
};

export const updatePassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await handleResponse(response);
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return await handleResponse(response);
};

export const resetPassword = async (email, otp, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
    });
    return await handleResponse(response);
};

// Organization & Project APIs
export const createOrganization = async (name) => {
    const response = await fetch(`${API_URL}/api/hierarchy/organizations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });
    return await handleResponse(response);
};

export const getOrganizations = async () => {
    const response = await fetch(`${API_URL}/api/hierarchy/organizations`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return await handleResponse(response);
};

export const createProject = async (name, organizationId) => {
    const response = await fetch(`${API_URL}/api/hierarchy/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, organizationId }),
    });
    return await handleResponse(response);
};

export const getProjects = async (organizationId) => {
    const response = await fetch(`${API_URL}/api/hierarchy/projects?organizationId=${organizationId}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return await handleResponse(response);
};
