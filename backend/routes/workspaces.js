import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireWorkspaceRole, ensureWorkspaceOwner } from '../middleware/workspaceAuth.js';
import { Workspace, WorkspaceUser, User } from '../models/index.js';

const router = Router();

router.post('/workspaces', authenticate, async (req, res) => {
	const { name } = req.body;
	if (!name) return res.status(400).json({ message: 'Workspace name required' });
	try {
		const workspace = await Workspace.create({ name, owner_user_id: req.user.id });
		await WorkspaceUser.create({ workspace_id: workspace.id, user_id: req.user.id, role: 'owner' });
		return res.status(201).json(workspace);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Create workspace failed' });
	}
});

router.post('/workspaces/:workspaceId/users', authenticate, requireWorkspaceRole(['owner']), async (req, res) => {
	const { workspaceId } = req.params;
	const { userId, role = 'member' } = req.body;
	if (!userId) return res.status(400).json({ message: 'userId required' });
	if (!['admin', 'member'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
	try {
		const user = await User.findOne({ where: { id: userId, deleted_at: null } });
		if (!user) return res.status(404).json({ message: 'User not found' });
		const membership = await WorkspaceUser.findOne({ where: { workspace_id: workspaceId, user_id: userId } });
		if (membership) return res.status(409).json({ message: 'User already in workspace' });
		await WorkspaceUser.create({ workspace_id: workspaceId, user_id: userId, role });
		return res.status(201).json({ message: 'User added to workspace' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Add user failed' });
	}
});

router.get('/workspaces/:workspaceId/users', authenticate, requireWorkspaceRole(['owner', 'admin']), async (req, res) => {
	const { workspaceId } = req.params;
	try {
		const members = await WorkspaceUser.findAll({ where: { workspace_id: workspaceId } });
		return res.json(members);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Fetch members failed' });
	}
});

export default router;
