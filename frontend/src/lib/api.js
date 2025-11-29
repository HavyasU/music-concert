export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });

        // Try to parse JSON safely
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // If response is not JSON (e.g., HTML error page), get text
            const text = await response.text();
            data = { message: text || 'Server error' };
        }

        if (!response.ok) {
            throw new Error(data.message || `Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        // Re-throw with meaningful message
        if (error instanceof SyntaxError) {
            throw new Error('Server returned invalid data. Please contact support.');
        }
        throw error;
    }
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};
