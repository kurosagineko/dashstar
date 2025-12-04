import { Router } from 'express';
import { Task, Team, TeamMember } from '../models/indexModel.js';

const router = Router();

//============================= GET =========================================
router.get('/tasks', async (req, res) => {
	const user_id = Number(req.query.user_id);
	if (!Number.isInteger(user_id) || user_id <= 0) {
		return res.status(400).json({ error: 'Invalid task user_id' });
	}

	if (!user_id) {
		return res.status(400).json({ error: 'user_id required' });
	}

	try {
		const teams = await Team.findAll({
			where: { admin_user_id: user_id },
		});

		let taskList = [];

		for (const t of teams) {
			const tasks = await Task.findAll({ where: { team_id: t.id } });
			taskList.push(...tasks);
		}

		if (!teams) {
			return res
				.status(404)
				.json({ error: 'Team not found or you are not a member' });
		}

		return res.status(200).json({ tasks: taskList });
	} catch (error) {
		res.status(404).json({ error: 'No tasks found' });
	}
});

//================================== Create ==========================================
router.post('/tasks', async (req, res) => {
	const { user_id, task_name, task_desc, date_due, team_name } = req.body;

	if (!user_id || !task_name || !task_desc || !team_name) {
		return res.status(400).json({ error: 'Some missing values' });
	}

	try {
		const team = await Team.findOne({
			where: { admin_user_id: user_id, name: team_name },
		});

		if (!team) {
			return res.status(404).json({ error: 'Team not found for this user' });
		}

		const transaction = await Task.sequelize.transaction();
		const task = await Task.create(
			{
				team_id: team.id,
				created_by_user_id: user_id,
				task_name,
				task_desc,
				status: 'open',
				task_xp: 10,
			},
			{ transaction }
		);
		await transaction.commit();

		return res.status(201).json({ task_created: task });
	} catch (error) {
		console.error('Error while creating task:', error);
		return res.status(500).json({ error: 'Failed to create task' });
	}
});

//==================================== Edit ==============================================
router.post('/tasks/:id', async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res.status(400).json({ error: 'Invalid task id' });
	}

	const user_id = Number(req.body.user_id);
	if (!Number.isInteger(user_id) || user_id <= 0) {
		return res.status(400).json({ error: 'Invalid task user_id' });
	}

	const { task_name, task_desc, status } = req.body;

	const task = await Task.findOne({ where: { id: id } });

	if (!task) {
		return res.status(404).json({ error: 'Task not found' });
	}

	const changes = {};

	if (task_name !== task.task_name || task_name !== '')
		changes.task_name = task_name;
	if (task_desc !== task.task_desc || task_desc !== '')
		changes.task_desc = task_desc;
	if (status !== task.status) changes.status = status;

	if (Object.keys(changes).length === 0) {
		return res.status(400).json({ error: 'No change to apply' });
	}

	try {
		const transaction = await Task.sequelize.transaction();
		await Task.update(changes, { where: { id: id } }, { transaction });
		await transaction.commit();

		const updatedTask = await Task.findByPk(id);
		return res.status(201).json({ updatedTask: updatedTask });
	} catch (error) {
		console.error('Error while editing task:', error);
		return res.status(500).json({ error: 'Failed to edit task' });
	}
});


export default router;
