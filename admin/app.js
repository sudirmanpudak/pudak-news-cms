// Logic otomatis untuk mendeteksi URL Backend (Local vs Codespaces)
let API_URL = 'http://localhost:3000/api';

if (window.location.hostname.includes('github.dev')) {
    // Jika di Codespaces, kita ganti port 5500 (frontend) ke 3000 (backend)
    const backendHost = window.location.host.replace('-5500', '-3000');
    API_URL = `${window.location.protocol}//${backendHost}/api`;
} else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Jika sudah di hosting beneran nantinya
    API_URL = `${window.location.protocol}//${window.location.host}/api`;
}

// --- AUTH FUNCTIONS ---

async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
    return token;
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

// --- NEWS API FUNCTIONS ---

async function getStats() {
    const response = await fetch(`${API_URL}/stats`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}

async function getAllNews() {
    const response = await fetch(`${API_URL}/news`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}

async function getNewsById(id) {
    const response = await fetch(`${API_URL}/news/${id}`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}

async function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this news?')) return;
    
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.ok;
}

async function toggleNewsStatus(id, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'hold' : 'published';
    const response = await fetch(`${API_URL}/news/${id}/status`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    });
    return response.ok;
}

// Helper to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper to get image URL
function getImageUrl(imagePath) {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${imagePath}`;
}
