import { Router } from 'express';
import { Schedule, Team, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireWorkspaceMember, requireWorkspaceRole } from '../middleware/workspaceAuth.js';

const router = Router();

router.post('/admin/schedules', authenticate, requireWorkspaceRole(['admin']), async (req, res) => {
	const {
		title,
		message,
		description,
		time_start,
		time_end,
		start_at,
		end_at,
		status = 'planned',
		target_team_id,
		target_user_id,
		team_id,
	} = req.body;
	if (!title && !message) return res.status(400).json({ message: 'title or message required' });
	try {
		if (target_team_id) {
			const team = await Team.findOne({ where: { id: target_team_id, workspace_id: req.workspaceId, deleted_at: null } });
			if (!team) return res.status(404).json({ message: 'Target team not found' });
		}
		if (target_user_id) {
			const user = await User.findOne({ where: { id: target_user_id, deleted_at: null } });
		if (!user) return res.status(404).json({ message: 'Target user not found' });
	}
	const schedule = await Schedule.create({
		workspace_id: req.workspaceId,
		workspace_code: req.workspaceCode,
		team_id: team_id || target_team_id || null,
		title,
		message,
		description,
		time_start: time_start || null,
		time_end: time_end || null,
		start_at: start_at || null,
		end_at: end_at || null,
		status,
		target_team_id: target_team_id || null,
		target_user_id: target_user_id || null,
		created_by: req.user.id,
	});
		return res.status(201).json(schedule);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Create schedule failed' });
	}
});

router.get('/schedules', authenticate, requireWorkspaceMember, async (req, res) => {
	try {
		const schedules = await Schedule.findAll({ where: { workspace_id: req.workspaceId } });
		return res.json(schedules);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Fetch schedules failed' });
	}
});

export default router;
