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

// app.all('*', (req, res) => {
// 	res.status(404).json({ message: 'Route not found' });
// });

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

import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { query, body, param, validationResult } from 'express-validator';
require('dotenv').config();

const router = express.Router();
const PORT = process.env.PORT;
const BCRYPT_COST = parseInt(process.env.BCRYPT_COST) || 10;

app.use(cors());
app.use(express.json());

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	dialect: 'postgres',
	port: DB_PORT,
	logging: console.log,
});

// Define user model
const Users = sequelize.define(
	'Users',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.NUMBER, // the id of a team, -1 means no assigned team
			allowNull: true,
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
			type: DataTypes.ARRAY, // list of task_id's, once in team, admins make tasks that are team wide, users then select and assign task to themselves
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
const Teams = sequelize.define(
	'Teams',
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
const Tasks = sequelize.define(
	'Tasks',
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
const Schedules = sequelize.define(
	'Schedules',
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
const Messages = sequelize.define(
	'Messages',
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

// ============================== User ========================================
// create a user
router.post(
	'/users',
	[
		body('workspace_code').notEmpty(),
		body('name').trim().notEmpty(),
		body('email').isEmail().notEmpty(),
		body('password')
			.isLength({ min: 8 })
			.withMessage('Password must be at least 8 characters')
			.notEmpty(),
		body('role').isIn(['user', 'admin']).notEmpty(),
		body('pfp').optional(),
		validate,
	],
	async (req, res) => {
		const { workspace_code, name, email, password, role, pfp } = req.body;

		if (!workspace_code || !name || !email || !password || !role) {
			return res.status(400).json('Missing details');
		}

		const exists = await Users.findOne({
			where: { email, workspace_code },
		});
		if (exists) {
			return res.status(409).json({
				error: 'A user with that email already exists in this workspace',
			});
		}

		const hashedPass = await bcrypt.hash(password, BCRYPT_COST);

		try {
			await Users.create({
				team_id: -1,
				workspace_code,
				name,
				email,
				password: hashedPass,
				role,
				current_tasks: [],
				level: 1,
				xp: 0,
				numTasksCompleted: 0,
				pfp: pfp || null,
			});
			res.status(201).json('New user created!'); // don't send the user details back for security
		} catch (error) {
			res.status(500).json({ error: 'Error creating user' });
		}
	}
);

// ======== All incorrect, needs redone

// // get details of the user logged in
// app.get('/users/:id', async (req, res) => {
// 	const { id } = req.params;
// 	const { workspace_code } = req.body;

// 	if (!workspace_code) {
// 		return res.status(400).json('Must have workspace code in body');
// 	}

// 	try {
// 		const user = await Users.find({
// 			where: {
// 				id: id,
// 				workspace_code: workspace_code,
// 			},
// 		});
// 		res.status(200).json(user);
// 	} catch (error) {
// 		res.status(404).json({ error: 'Error getting user details' });
// 	}
// });

// // admin get all users details that share workspace code
// app.get('/users', async (req, res) => {
// 	const { workspace_code } = req.body;

// 	if (!workspace_code) {
// 		return res.status(400).json('Must have workspace code in body');
// 	}

// 	try {
// 		const users = await Users.findAll({
// 			where: {
// 				workspace_code: workspace_code,
// 			},
// 		});
// 		res.status(200).json(users);
// 	} catch (error) {
// 		res.status(404).json({ error: 'Error getting users' });
// 	}
// });

// // get all users in a team
// app.get('/teams/:team_id/users', async (req, res) => {
// 	const { team_id } = req.params;
// 	const { workspace_code } = req.body;

// 	if (!workspace_code) {
// 		return res.status(400).json('Must have workspace code in body');
// 	}

// 	try {
// 		const users = await Users.findAll({
// 			where: {
// 				team_id: team_id,
// 				workspace_code: workspace_code,
// 			},
// 		});
// 		res.status(200).json(users);
// 	} catch (error) {
// 		res.status(404).json({ error: 'Error getting users' });
// 	}
// });

// // admin add user to a team
// app.patch('/teams/:team_id', async (req, res) => {
// 	const { team_id } = req.params;
// 	const { workspace_code, user_id } = req.body;

// 	if (!workspace_code) {
// 		return res.status(400).json('Must have workspace code in body');
// 	}

// 	try {
// 		const user = await Users.findOne({
// 			where: {
// 				id: user_id,
// 				workspace_code: workspace_code,
// 			},
// 		});

// 		await user.update({
// 			team_id,
// 		});

// 		res.status(200).json('User updated!');
// 	} catch (error) {
// 		res.status(404).json({ error: 'Error getting users' });
// 	}
// });

// // ======================================================================

// // ============================== Task ========================================
// // gets tasks available to team of users
// app.get('/tasks/:team_id', async (req, res) => {
// 	// must be logged in to access this route and have correct workspace code
// 	const { team_id } = req.params;
// 	const { workspace_code } = req.body;

// 	try {
// 		const tasks = await task.findAll({
// 			where: {
// 				team_id: team_id,
// 				workspace_code: workspace_code,
// 			},
// 		});
// 		res.json(tasks);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Error retrieving tasks' });
// 	}
// });

// // admin create task for a team
// app.post('/tasks/:team_id', async (req, res) => {
// 	// must have admin role to access this route and have correct workspace code
// 	try {
// 		const { team_id, workspace_code, task_name, task_desc, date_due, task_xp } =
// 			req.body;
// 		const newTask = await task.create({
// 			team_id: team_id,
// 			workspace_code: workspace_code,
// 			task_name: task_name,
// 			task_desc: task_desc,
// 			date_created: new Date().toUTCString(),
// 			date_due: date_due,
// 			status: 'task',
// 			task_xp: task_xp,
// 		});
// 		res.status(201).json(newTask);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Error creating task' });
// 	}
// });

// // admin edit task
// app.put('/tasks/:id', async (req, res) => {
// 	// must have admin role to access this route and have correct workspace code
// 	const { id } = req.params;
// 	try {
// 		// const {       // horribly wrong
// 		// 	team_id,
// 		// 	workspace_code,
// 		// 	task_name,
// 		// 	task_desc,
// 		// 	date_due,
// 		// 	status,
// 		// 	task_xp,
// 		// } = req.body;
// 		// const editedTask = await task.update(
// 		// 	{
// 		// 		team_id: team_id,
// 		// 		workspace_code: workspace_code,
// 		// 		task_name: task_name,
// 		// 		task_desc: task_desc,
// 		// 		date_due: date_due,
// 		// 		status: status,
// 		// 		task_xp: task_xp,
// 		// 	},
// 		// 	{ where: { id: id, workspace_code: workspace_code } }
// 		// );
// 		res.status(201).json(editedTask);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Error editing task' });
// 	}
// });

// // admin delete task
// app.delete('/tasks/:id', async (req, res) => {
// 	// must have admin role to access this route and have correct workspace code
// 	const { id } = req.params;
// 	const { workspace_code } = req.body;
// 	try {
// 		const deletedTask = await task.destroy({
// 			where: { id: id, workspace_code: workspace_code },
// 		});
// 		res.status(201).json(deletedTask);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Error editing task' });
// 	}
// });
// //==================================================================================

// // // catch routes not coded
// // app.all('/*', (req, res) => {
// // 	res.status(404).send('Route not found');
// // });

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
