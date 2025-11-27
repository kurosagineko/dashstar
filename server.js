// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import authRoutes from './backend/routes/auth.js';
// import teamRoutes from './backend/routes/teams.js';
// import taskRoutes from './backend/routes/tasks.js';
// import userRoutes from './backend/routes/users.js';
// import scheduleRoutes from './backend/routes/schedules.js';
// import messageRoutes from './backend/routes/messages.js';
// import workspaceRoutes from './backend/routes/workspaces.js';
// import { sequelize } from './backend/models/index.js';

// const app = express();
// const PORT = process.env.PORT || 3001;
// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET || JWT_SECRET === 'dev-secret' || JWT_SECRET === 'change_me_to_a_long_random_value') {
// 	console.error('JWT_SECRET must be set to a strong value in .env');
// 	process.exit(1);
// }

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api', teamRoutes);
// app.use('/api', taskRoutes);
// app.use('/api', userRoutes);
// app.use('/api', scheduleRoutes);
// app.use('/api', messageRoutes);
// app.use('/api', workspaceRoutes);

// app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// (async () => {
// 	try {
// 		await sequelize.authenticate();
// 		await sequelize.sync();

// 		const server = app.listen(PORT, () => {
// 			console.log(`Server is listening at http://localhost:${PORT}`);
// 		});

// 		server.on('error', err => {
// 			console.error('HTTP server error:', err);
// 			process.exit(1);
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		process.exit(1);
// 	}
// })();

const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

// Setup Sequelize with MySQL database
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	dialect: 'postgres',
	port: DB_PORT,
	logging: console.log,
});

// Define user model
const user = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.NUMBER, // the id of a team
			allowNull: false,
		},
		workspace_code: {
			type: DataTypes.TEXT, // a code that links admins and users, with this admins can select users with same code for teams
			allowNull: false,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		role: {
			type: DataTypes.TEXT, // can select user or admin, anyone can be admin but without users with the same code, they cant do much
			allowNull: false,
		},
		current_tasks: {
			type: DataTypes.ARRAY, // once in team, admins make tasks that are team wide, users then select and assign task to themselves
			allowNull: true,
		},
		level: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		xp: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		numTasksCompleted: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		pfp: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		timestamps: false,
	}
);

// a team created by an admin, admin then can choose users who have the same workspace code as them
//admins can create any amount of teams with any number of users as long as everyone's workspace code is equal
// Define team model
const team = sequelize.define(
	'team',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		workspace_code: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		team_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_id_list: {
			type: DataTypes.ARRAY, // list of user id's in this team
			allowNull: false,
		},
		admin_id: {
			type: DataTypes.NUMBER, // id of the admin role user who created the team and assigned users to the team
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

// tasks are assigned to teams not individual users
// the user then assigns the task to themselves
// Define task model
const task = sequelize.define(
	'task',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		workspace_code: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		task_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		task_desc: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		date_created: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		date_due: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.TEXT, // can be [task, inprogress or complete]
			allowNull: false,
		},
		task_xp: {
			type: DataTypes.NUMBER,
			allowNull: true,
		},
	},
	{
		timestamps: false,
	}
);

// a schedule item is team wide, for allocating meeting times or deadlines, only admins can create
// Define schedule model
const schedule = sequelize.define(
	'schedule',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		workspace_code: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		time_start: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		time_end: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

// short messages shown team wide, only admin can create
// Define message model
const message = sequelize.define(
	'message',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		workspace_code: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		date_created: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

// ============================== Task ========================================
// gets tasks available to team of users
app.get('/tasks/:team_id', async (req, res) => {
	// must be logged in to access this route and have correct workspace code
	const { team_id } = req.params;
	const { workspace_code } = req.body;

	try {
		const tasks = await task.findAll({
			where: {
				team_id: team_id,
				workspace_code: workspace_code,
			},
		});
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: 'Error retrieving tasks' });
	}
});

// admin create task for a team
app.post('/tasks/:team_id', async (req, res) => {
	// must have admin role to access this route and have correct workspace code
	try {
		const { team_id, workspace_code, task_name, task_desc, date_due, task_xp } =
			req.body;
		const newTask = await task.create({
			team_id: team_id,
			workspace_code: workspace_code,
			task_name: task_name,
			task_desc: task_desc,
			date_created: new Date().toUTCString(),
			date_due: date_due,
			status: 'task',
			task_xp: task_xp,
		});
		res.status(201).json(newTask);
	} catch (error) {
		res.status(500).json({ error: 'Error creating task' });
	}
});

// admin edit task
app.put('/tasks/:id', async (req, res) => {
	// must have admin role to access this route and have correct workspace code
	const { id } = req.params;
	try {
		const {
			team_id,
			workspace_code,
			task_name,
			task_desc,
			date_due,
			status,
			task_xp,
		} = req.body;
		const editedTask = await task.update(
			{
				team_id: team_id,
				workspace_code: workspace_code,
				task_name: task_name,
				task_desc: task_desc,
				date_due: date_due,
				status: status,
				task_xp: task_xp,
			},
			{ where: { id: id } }
		);
		res.status(201).json(editedTask);
	} catch (error) {
		res.status(500).json({ error: 'Error editing task' });
	}
});

// admin delete task
app.delete('/tasks/:id', async (req, res) => {
	// must have admin role to access this route and have correct workspace code
	const { id } = req.params;
	const { workspace_code } = req.body;
	try {
		const deletedTask = await task.destroy({
			where: { id: id, workspace_code: workspace_code },
		});
		res.status(201).json(deletedTask);
	} catch (error) {
		res.status(500).json({ error: 'Error editing task' });
	}
});
//==================================================================================

// // catch routes not coded
// app.all('/*', (req, res) => {
// 	res.status(404).send('Route not found');
// });

(async () => {
	try {
		await sequelize.authenticate();
		console.log('connection established');

		await sequelize.sync();

		const server = app.listen(PORT, () => {
			console.log(`Server is listening at http://localhost:${PORT}`);
		});

		server.on('error', err => {
			console.error('HTTP server error:', err);
			process.exit(1);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();

// // sudo mysql -u <username> -p -h <host>

// export NODE_EXTRA_CA_CERTS=$(pwd)/certs/aiven-ca.pem
