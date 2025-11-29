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
import { Sequelize, DataTypes, Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { query, body, param, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { message } from 'antd';
dotenv.config();

const router = express.Router();
const PORT = process.env.PORT;
const BCRYPT_COST = parseInt(process.env.BCRYPT_COST) || 10;

router.use(cors());
router.use(express.json());

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
	dialect: 'mysql',
	port: DB_PORT,
	logging: console.log,
});

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING(50),
			unique: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(150),
			unique: true,
			allowNull: false,
		},
		password_hash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('admin', 'user'),
			defaultValue: 'user',
			allowNull: false,
		},
		level: {
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 1,
			allowNull: false,
		},
		xp: {
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 0,
			allowNull: false,
		},
		numTasksCompleted: {
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 0,
			allowNull: false,
		},
		theme: {
			type: DataTypes.STRING(50),
			defaultValue: 'dark',
			allowNull: false,
		},
		avatar_url: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	},
	{
		tableName: 'Users',
		timestamps: true,
		paranoid: true,
		underscored: true,
	}
);
User.associate = models => {
	// A user can belong to many workspaces (member or admin)
	User.belongsToMany(models.Workspace, {
		through: models.UserWorkspace,
		foreignKey: 'user_id',
		otherKey: 'workspace_id',
	});

	// Workspaces where the user is the *owner* (admin_user_id)
	User.hasMany(models.Workspace, {
		foreignKey: 'admin_user_id',
		as: 'ownedWorkspaces',
	});

	// Teams that the user created (team admin)
	User.hasMany(models.Team, {
		foreignKey: 'admin_user_id',
		as: 'adminTeams',
	});

	// Teams the user is a member of (through TeamMembers)
	User.belongsToMany(models.Team, {
		through: models.TeamMember,
		foreignKey: 'user_id',
		otherKey: 'team_id',
	});

	// Tasks created by the user (admin only)
	User.hasMany(models.Task, {
		foreignKey: 'created_by_user_id',
		as: 'createdTasks',
	});

	// Schedules created by the user
	User.hasMany(models.Schedule, {
		foreignKey: 'created_by_user_id',
		as: 'createdSchedules',
	});

	// Messages created by the user
	User.hasMany(models.Message, {
		foreignKey: 'created_by_user_id',
		as: 'createdMessages',
	});
};

const Workspace = sequelize.define(
	'Workspace',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING(64),
			unique: true,
			allowNull: false,
		},
		admin_user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onDelete: 'RESTRICT',
		},
	},
	{
		tableName: 'Workspaces',
		timestamps: true,
		underscored: true,
	}
);
Workspace.associate = models => {
	// The owner (admin) of the workspace
	Workspace.belongsTo(models.User, {
		foreignKey: 'admin_user_id',
		as: 'admin',
	});

	// Users that belong to the workspace (member or admin)
	Workspace.belongsToMany(models.User, {
		through: models.UserWorkspace,
		foreignKey: 'workspace_id',
		otherKey: 'user_id',
	});

	// Teams that live inside the workspace
	Workspace.hasMany(models.Team, {
		foreignKey: 'workspace_id',
		as: 'teams',
	});
};

const UserWorkspace = sequelize.define(
	'UserWorkspace',
	{
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: 'Users', key: 'id' },
			onDelete: 'CASCADE',
		},
		workspace_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: 'Workspaces', key: 'id' },
			onDelete: 'CASCADE',
		},
		role: {
			type: DataTypes.ENUM('admin', 'member'), // admin or member
			allowNull: false,
			defaultValue: 'member',
		},
	},
	{
		tableName: 'UserWorkspace',
		timestamps: true,
		underscored: true,
	}
);

const Team = sequelize.define(
	'Team',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		workspace_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Workspaces',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		admin_user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onDelete: 'RESTRICT',
		},
	},
	{
		tableName: 'Teams',
		timestamps: true,
		underscored: true,
		indexes: [
			{
				unique: true,
				fields: ['workspace_id', 'name'],
			},
		],
	}
);
Team.associate = models => {
	// Workspace that contains this team
	Team.belongsTo(models.Workspace, {
		foreignKey: 'workspace_id',
		as: 'workspace',
	});

	// The user who created / leads the team
	Team.belongsTo(models.User, {
		foreignKey: 'admin_user_id',
		as: 'admin',
	});

	// Users belonging to the team (many‑to‑many)
	Team.belongsToMany(models.User, {
		through: models.TeamMember,
		foreignKey: 'team_id',
		otherKey: 'user_id',
		as: 'members',
	});

	// Tasks, Schedules, Messages that belong to this team
	Team.hasMany(models.Task, { foreignKey: 'team_id', as: 'tasks' });
	Team.hasMany(models.Schedule, { foreignKey: 'team_id', as: 'schedules' });
	Team.hasMany(models.Message, { foreignKey: 'team_id', as: 'messages' });
};

const TeamMember = sequelize.define(
	'TeamMember',
	{
		team_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			references: { model: 'Teams', key: 'id' },
			onDelete: 'CASCADE',
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			references: { model: 'Users', key: 'id' },
			onDelete: 'CASCADE',
		},
	},
	{
		tableName: 'TeamMembers',
		timestamps: true,
		underscored: true,
	}
);

const Task = sequelize.define(
	'Task',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Teams',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		created_by_user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onDelete: 'RESTRICT',
		},
		task_name: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		task_desc: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		date_due: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('open', 'inprogress', 'complete'),
			allowNull: false,
			defaultValue: 'open',
		},
		task_xp: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 10,
			field: 'task_xp',
		},
	},
	{
		tableName: 'Tasks',
		timestamps: true,
		paranoid: true, // adds deletedAt (soft‑delete)
		underscored: true,
	}
);
Task.associate = models => {
	Task.belongsTo(models.Team, { foreignKey: 'team_id', as: 'team' });
	Task.belongsTo(models.User, {
		foreignKey: 'created_by_user_id',
		as: 'creator',
	});
};

const Schedule = sequelize.define(
	'Schedule',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Teams',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		created_by_user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onDelete: 'RESTRICT',
		},
		start_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('planned', 'active', 'complete', 'cancelled'),
			allowNull: false,
			defaultValue: 'planned',
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: 'Schedules',
		timestamps: true,
		underscored: true,
	}
);
Schedule.associate = models => {
	Schedule.belongsTo(models.Team, { foreignKey: 'team_id', as: 'team' });
	Schedule.belongsTo(models.User, {
		foreignKey: 'created_by_user_id',
		as: 'creator',
	});
};

const Message = sequelize.define(
	'Message',
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		team_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Teams',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		created_by_user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onDelete: 'RESTRICT',
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: 'Messages',
		timestamps: true, // adds createdAt / updatedAt
		underscored: true,
	}
);
Message.associate = models => {
	Message.belongsTo(models.Team, { foreignKey: 'team_id', as: 'team' });
	Message.belongsTo(models.User, {
		foreignKey: 'created_by_user_id',
		as: 'author',
	});
};

// ============================== User ========================================
// create a user
router.post(
	'/users',
	[
		body('username')
			.trim()
			.notEmpty()
			.withMessage('Username is required')
			.isAlphanumeric()
			.withMessage('Username may only contain letters & numbers'),

		body('email')
			.trim()
			.notEmpty()
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Must be a valid email address'),

		body('password')
			.notEmpty()
			.withMessage('Password is required')
			.isLength({ min: 8 })
			.withMessage('Password must be at least 8 characters'),

		body('role')
			.optional()
			.isIn(['user', 'admin'])
			.withMessage('Role must be either user or admin'),

		body('avatar_url')
			.optional()
			.isURL()
			.withMessage('Avatar URL must be a valid URL'),
		validate,
	],
	async (req, res) => {
		const { username, email, password, role = 'user', avatar_url } = req.body;

		const duplicate = await User.findOne({
			where: {
				[Op.or]: [{ email }, { name: username }],
			},
		});

		if (duplicate) {
			// Let the client know exactly what is duplicated
			const conflictField = duplicate.email === email ? 'email' : 'username';
			return res.status(409).json({
				error: {
					message: `A user with that ${conflictField} already exists`,
				},
			});
		}

		const hashedPass = await bcrypt.hash(password, BCRYPT_COST);

		try {
			await User.create({
				username,
				email,
				password_hash: hashedPass,
				role,
				avatar_url: avatar_url || null,
			});
			res.status(201).json({ success: { message: 'New user created!' } }); // don't send the user details back for security
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				// Dupe managed to slip past check
				return res
					.status(409)
					.json({ error: { message: 'Email or username already taken' } });
			}
			res.status(500).json({ error: { message: 'Error creating user' } });
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
	// Quick seeded data, delete later

	await sequelize.sync({ force: true });

	// Create an admin user
	const admin = await User.create({
		username: 'Alice Admin',
		email: 'alice@example.com',
		password_hash: '<<bcrypt‑hash>>',
		role: 'admin',
		level: 5,
		xp: 1500,
	});

	// Admin creates a workspace
	const ws = await Workspace.create({
		code: 'ABCD-2025',
		admin_user_id: admin.id,
	});

	// Register a regular user that joins the workspace
	const bob = await User.create({
		username: 'Bob Bobson',
		email: 'bob@example.com',
		password_hash: '<<bcrypt‑hash>>',
		role: 'user',
	});

	await UserWorkspace.create({
		user_id: bob.id,
		workspace_id: ws.id,
		role: 'member',
	});

	// Admin creates a team inside that workspace
	const teamAlpha = await Team.create({
		workspace_id: ws.id,
		name: 'Team Alpha',
		admin_user_id: admin.id,
	});

	// Add Bob to the team
	await TeamMember.create({
		team_id: teamAlpha.id,
		user_id: bob.id,
	});

	// Admin creates a task for the team
	const task = await Task.create({
		team_id: teamAlpha.id,
		created_by_user_id: admin.id,
		task_name: 'Design UI',
		task_desc: 'Create mockups for the dashboard',
		date_due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
		status: 'open',
		task_xp: 20,
	});

	console.log('✅ Demo data inserted, everything lines‑up!');
	process.exit(0);
})();

// Use this one for prod
// (async () => {
// 	try {
// 		await sequelize.authenticate();
// 		console.log('connection established');

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

// // sudo mysql -u <username> -p -h <host>

// export NODE_EXTRA_CA_CERTS=$(pwd)/certs/aiven-ca.pem
