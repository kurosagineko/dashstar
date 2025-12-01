import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { clearAuthHeaders, setAuthHeaders } from '../api/client';

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [workspaceId, setWorkspaceId] = useState(() => localStorage.getItem('workspaceId'));
	const [workspaceCode, setWorkspaceCode] = useState(() => localStorage.getItem('workspaceCode'));
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		return raw ? JSON.parse(raw) : null;
	});

	useEffect(() => {
		setAuthHeaders({ token, workspaceId, workspaceCode });
	}, [token, workspaceId, workspaceCode]);

	const login = ({ token: newToken, workspaceId: newWorkspaceId, workspaceCode: newWorkspaceCode, workspace_id, workspace_code, user: newUser }) => {
		const resolvedWorkspaceId = newWorkspaceId ?? workspace_id ?? null;
		const resolvedWorkspaceCode = newWorkspaceCode ?? workspace_code ?? null;
		setToken(newToken);
		setWorkspaceId(resolvedWorkspaceId);
		setWorkspaceCode(resolvedWorkspaceCode);
		setUser(newUser || null);
		if (newUser) {
			localStorage.setItem('user', JSON.stringify(newUser));
		} else {
			localStorage.removeItem('user');
		}
	};

	const switchWorkspace = ({ workspaceId: nextWorkspaceId, workspaceCode: nextWorkspaceCode, workspace_id, workspace_code }) => {
		const resolvedWorkspaceId = nextWorkspaceId ?? workspace_id ?? null;
		const resolvedWorkspaceCode = nextWorkspaceCode ?? workspace_code ?? null;
		setWorkspaceId(resolvedWorkspaceId);
		setWorkspaceCode(resolvedWorkspaceCode);
	};

	const logout = () => {
		setToken(null);
		setWorkspaceId(null);
		setWorkspaceCode(null);
		setUser(null);
		clearAuthHeaders();
		localStorage.removeItem('user');
	};

	const value = useMemo(
		() => ({
			token,
			workspaceId,
			workspaceCode,
			user,
			login,
			switchWorkspace,
			logout,
			setWorkspaceId,
			setWorkspaceCode,
		}),
		[token, workspaceId, workspaceCode, user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
