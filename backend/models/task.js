export default (sequelize, DataTypes) =>
	sequelize.define(
		'tasks',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			workspace_code: { type: DataTypes.STRING(64), allowNull: false },
			team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			title: { type: DataTypes.STRING(150), allowNull: false },
			desc: { type: DataTypes.TEXT, allowNull: true },
			description: { type: DataTypes.TEXT, allowNull: true },
			status: {
				type: DataTypes.ENUM('open', 'inprogress', 'complete'),
				allowNull: false,
				defaultValue: 'open',
			},
			task_xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			xp_reward: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			date_created: { type: DataTypes.STRING(50), allowNull: true },
			date_due: { type: DataTypes.STRING(50), allowNull: true },
			due_date: { type: DataTypes.DATE, allowNull: true },
			created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			deleted_at: { type: DataTypes.DATE, allowNull: true },
		},
		{ timestamps: false }
	);
