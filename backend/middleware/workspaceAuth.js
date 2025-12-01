import { Workspace, WorkspaceUser } from '../models/index.js';

async function resolveWorkspaceFromCode({ workspaceCode }) {
	if (!workspaceCode) return null;
	return Workspace.findOne({ where: { workspace_code: workspaceCode } });
}

export function requireWorkspaceRole(allowedRoles = ['admin']) {
	return async (req, res, next) => {
		const workspaceCode = req.headers['x-workspace-code'];
		if (!workspaceCode) return res.status(400).json({ message: 'workspace code required' });
		const workspaceIdParam = req.params.workspaceId;
		try {
			const workspace = await resolveWorkspaceFromCode({ workspaceCode });
			if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
			if (workspaceIdParam && Number(workspaceIdParam) !== Number(workspace.id)) {
				return res.status(400).json({ message: 'workspace mismatch' });
			}
			const membership = await WorkspaceUser.findOne({
				where: { workspace_id: workspace.id, user_id: req.user.id },
			});
			if (!membership) return res.status(403).json({ message: 'Not a workspace member' });
			if (!allowedRoles.includes(membership.role)) {
				return res.status(403).json({ message: 'Insufficient workspace role' });
			}
			req.workspaceId = Number(workspace.id);
			req.workspaceCode = workspace.workspace_code;
			req.workspaceRole = membership.role;
			return next();
		} catch (err) {
			console.error(err);
			return res.status(500).json({ message: 'Workspace check failed' });
		}
	};
}

export async function requireWorkspaceMember(req, res, next) {
	const workspaceCode = req.headers['x-workspace-code'];
	if (!workspaceCode) return res.status(400).json({ message: 'workspace code required' });
	const workspaceIdParam = req.params.workspaceId;
	try {
		const workspace = await resolveWorkspaceFromCode({ workspaceCode });
		if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
		if (workspaceIdParam && Number(workspaceIdParam) !== Number(workspace.id)) {
			return res.status(400).json({ message: 'workspace mismatch' });
		}
		const membership = await WorkspaceUser.findOne({
			where: { workspace_id: workspace.id, user_id: req.user.id },
		});
		if (!membership) return res.status(403).json({ message: 'Not a workspace member' });
		req.workspaceId = Number(workspace.id);
		req.workspaceCode = workspace.workspace_code;
		req.workspaceRole = membership.role;
		return next();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Workspace check failed' });
	}
}

export async function ensureWorkspaceOwner(req, res, next) {
	const workspaceCode = req.headers['x-workspace-code'];
	if (!workspaceCode) return res.status(400).json({ message: 'workspace code required' });
	try {
		const workspace = await resolveWorkspaceFromCode({ workspaceCode });
		if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
		if (workspace.owner_user_id !== req.user.id) {
			return res.status(403).json({ message: 'Owner role required' });
		}
		req.workspaceId = Number(workspace.id);
		req.workspaceCode = workspace.workspace_code;
		req.workspaceRole = 'admin';
		return next();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Workspace check failed' });
	}
}
