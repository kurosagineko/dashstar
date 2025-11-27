import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
});

let authState = { token: null, workspaceId: null };

export function setAuthHeaders({ token, workspaceId }) {
	authState = { token, workspaceId };
	if (token) {
		localStorage.setItem('token', token);
	} else {
		localStorage.removeItem('token');
	}

	if (workspaceId) {
		localStorage.setItem('workspaceId', workspaceId);
	} else {
		localStorage.removeItem('workspaceId');
	}
}

export function clearAuthHeaders() {
	setAuthHeaders({ token: null, workspaceId: null });
}

api.interceptors.request.use(config => {
	const token = authState.token || localStorage.getItem('token');
	const workspaceId = authState.workspaceId || localStorage.getItem('workspaceId');

	if (token) config.headers.Authorization = `Bearer ${token}`;
	if (workspaceId) config.headers['X-Workspace-Id'] = workspaceId;
	return config;
});

export default api;
