import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthHeaders, setAuthHeaders } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [workspaceId, setWorkspaceId] = useState(() => localStorage.getItem('workspaceId'));
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		return raw ? JSON.parse(raw) : null;
	});

	useEffect(() => {
		setAuthHeaders({ token, workspaceId });
	}, [token, workspaceId]);

	const login = ({ token: newToken, workspaceId: newWorkspaceId, user: newUser }) => {
		setToken(newToken);
		setWorkspaceId(newWorkspaceId || null);
		setUser(newUser || null);
		if (newUser) {
			localStorage.setItem('user', JSON.stringify(newUser));
		} else {
			localStorage.removeItem('user');
		}
	};

	const logout = () => {
		setToken(null);
		setWorkspaceId(null);
		setUser(null);
		clearAuthHeaders();
		localStorage.removeItem('user');
	};

	const value = useMemo(
		() => ({
			token,
			workspaceId,
			user,
			login,
			logout,
			setWorkspaceId,
		}),
		[token, workspaceId, user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
