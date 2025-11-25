import { Router } from 'express';
import { Task, TaskAssignment, User, WorkspaceUser } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireWorkspaceRole, requireWorkspaceMember } from '../middleware/workspaceAuth.js';

const router = Router();

router.post('/admin/tasks', authenticate, requireWorkspaceRole(['owner', 'admin']), async (req, res) => {
	const { title, description, xp_reward, due_date, status = 'draft' } = req.body;
	if (!title) return res.status(400).json({ message: 'Title required' });
	try {
		const task = await Task.create({
			workspace_id: req.workspaceId,
			title,
			description,
			xp_reward: xp_reward ?? 10,
			due_date: due_date || null,
			status,
			created_by: req.user.id,
		});
		return res.status(201).json(task);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Create task failed' });
	}
});

router.put('/admin/tasks/:taskId', authenticate, requireWorkspaceRole(['owner', 'admin']), async (req, res) => {
	const { taskId } = req.params;
	const { title, description, xp_reward, due_date, status } = req.body;
	try {
		const task = await Task.findOne({ where: { id: taskId, workspace_id: req.workspaceId, deleted_at: null } });
		if (!task) return res.status(404).json({ message: 'Task not found' });
		await task.update({
			title: title ?? task.title,
			description: description ?? task.description,
			xp_reward: xp_reward ?? task.xp_reward,
			due_date: due_date ?? task.due_date,
			status: status ?? task.status,
		});
		return res.json(task);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Update task failed' });
	}
});

router.delete('/admin/tasks/:taskId', authenticate, requireWorkspaceRole(['owner', 'admin']), async (req, res) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findOne({ where: { id: taskId, workspace_id: req.workspaceId, deleted_at: null } });
		if (!task) return res.status(404).json({ message: 'Task not found' });
		await task.update({ deleted_at: new Date(), status: 'archived' });
		return res.json({ message: 'Task deleted' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Delete task failed' });
	}
});

router.post('/admin/tasks/:taskId/assign', authenticate, requireWorkspaceRole(['owner', 'admin']), async (req, res) => {
	const { taskId } = req.params;
	const { userId } = req.body;
	if (!userId) return res.status(400).json({ message: 'User required' });
	try {
		const task = await Task.findOne({ where: { id: taskId, workspace_id: req.workspaceId, deleted_at: null } });
		if (!task) return res.status(404).json({ message: 'Task not found' });
		const user = await User.findOne({ where: { id: userId, deleted_at: null } });
		if (!user) return res.status(404).json({ message: 'User not found' });
		const membership = await WorkspaceUser.findOne({ where: { workspace_id: req.workspaceId, user_id: userId } });
		if (!membership) return res.status(403).json({ message: 'User is not a member of this workspace' });
		const assignment = await TaskAssignment.create({ task_id: task.id, user_id: user.id, status: 'assigned' });
		return res.status(201).json(assignment);
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).json({ message: 'Task already assigned to user' });
		}
		console.error(err);
		return res.status(500).json({ message: 'Assign task failed' });
	}
});

router.get('/tasks', authenticate, requireWorkspaceMember, async (req, res) => {
	try {
		const tasks = await Task.findAll({ where: { workspace_id: req.workspaceId, deleted_at: null } });
		return res.json(tasks);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Fetch tasks failed' });
	}
});

export default router;
